/**
 * Importador de noticias desde el sitio anterior (WordPress, manolojimenez.mx).
 *
 * Uso:
 *   npx tsx scripts/import-wordpress.ts --limit 10          # las 10 notas más recientes
 *   npx tsx scripts/import-wordpress.ts --limit 100 --offset 10
 *   npx tsx scripts/import-wordpress.ts --desde 2026-01-01  # todas las publicadas desde esa fecha
 *   npx tsx scripts/import-wordpress.ts --all               # todo el archivo
 *
 * Qué hace con cada nota:
 * - Titular: de MAYÚSCULAS a formato oración, respetando nombres propios y siglas (ver PROPER_NOUNS).
 * - Contenido: convierte el HTML (párrafos, cursivas, negritas, enlaces, saltos de línea) al editor
 *   de Payload. Quita el primer párrafo si repite el titular y los párrafos vacíos.
 * - Fotos: la destacada va como "Imagen principal"; las demás fotos del texto se suben a Medios y
 *   quedan como bloques "Media" en el mismo lugar donde estaban.
 * - Extracto: el de WordPress, sin el titular repetido al inicio.
 *
 * Se puede correr varias veces sin duplicar nada:
 * - Las notas se identifican por su slug: si ya existe, se actualiza.
 * - Las fotos se identifican por su URL original (campo oculto `sourceUrl` en Medios).
 *
 * Importante: no correrlo mientras el servidor de desarrollo aplica cambios de esquema nuevos
 * (ambos intentarían crear tablas a la vez).
 */
import 'dotenv/config'

import fs from 'fs'
import os from 'os'
import path from 'path'

import { JSDOM } from 'jsdom'
import { getPayload, type Payload } from 'payload'

import config from '../src/payload.config'
import { toSentenceCase } from './sentenceCase'

const WP_API = 'https://manolojimenez.mx/wp-json/wp/v2'
const PER_PAGE = 100

// ---------------------------------------------------------------------------
// Argumentos
// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
const argValue = (name: string) => {
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : undefined
}
const importAll = args.includes('--all')
/** `--desde AAAA-MM-DD`: solo notas publicadas desde esa fecha (sin --limit, todas las que haya). */
const since = argValue('--desde')
if (since && !/^\d{4}-\d{2}-\d{2}$/.test(since))
  throw new Error('--desde debe tener el formato AAAA-MM-DD')
const limit =
  importAll || (since && !args.includes('--limit')) ? Infinity : Number(argValue('--limit') ?? 10)
const offset = Number(argValue('--offset') ?? 0)

// ---------------------------------------------------------------------------
// WordPress
// ---------------------------------------------------------------------------

type WPPost = {
  id: number
  date_gmt: string
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  featured_media: number
}

type WPMedia = { id: number; source_url: string; alt_text: string }

const fetchJson = async <T>(url: string): Promise<T> => {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetch(url, { headers: { 'User-Agent': 'mi-historia-manolo-importer' } })
    if (response.ok) return (await response.json()) as T
    if (attempt === 3) throw new Error(`${response.status} al pedir ${url}`)
    await new Promise((resolve) => setTimeout(resolve, 2000 * attempt))
  }
  throw new Error('inalcanzable')
}

const decodeEntities = (html: string) =>
  new JSDOM(`<p>${html}</p>`).window.document.body.textContent ?? ''

/** Normaliza para comparar textos (sin acentos, espacios ni signos). */
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\d]+/gu, '')
    .toLowerCase()

/** URL de la foto en su tamaño original: toma el candidato más grande del srcset o quita "-1024x683". */
const fullSizeUrl = (img: HTMLImageElement): string => {
  const srcset = img.getAttribute('srcset')
  if (srcset) {
    const candidates = srcset
      .split(',')
      .map((entry) => entry.trim().split(/\s+/))
      .map(([url, width]) => ({ url: url!, width: parseInt(width ?? '0', 10) }))
      .sort((a, b) => b.width - a.width)
    if (candidates[0]?.url) return candidates[0].url
  }
  const src = img.getAttribute('src') ?? ''
  return src.replace(/-\d+x\d+(\.\w+)$/, '$1')
}

// ---------------------------------------------------------------------------
// Medios
// ---------------------------------------------------------------------------

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wp-import-'))
const mediaCache = new Map<string, number>()

/** Sube la foto a Medios (o reutiliza la que ya tenga la misma URL de origen). */
const ensureMedia = async (payload: Payload, url: string, alt: string): Promise<number | null> => {
  const key = url.replace(/^https?:/, '')
  if (mediaCache.has(key)) return mediaCache.get(key)!

  const existing = await payload.find({
    collection: 'media',
    where: { sourceUrl: { equals: key } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs[0]) {
    mediaCache.set(key, existing.docs[0].id)
    return existing.docs[0].id
  }

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const filePath = path.join(tmpDir, decodeURIComponent(path.basename(new URL(url).pathname)))
    fs.writeFileSync(filePath, Buffer.from(await response.arrayBuffer()))

    const doc = await payload.create({
      collection: 'media',
      data: { alt: alt.slice(0, 250), sourceUrl: key },
      filePath,
    })
    fs.rmSync(filePath, { force: true })
    mediaCache.set(key, doc.id)
    return doc.id
  } catch (error) {
    payload.logger.warn(`  ⚠ No se pudo importar la foto ${url}: ${(error as Error).message}`)
    return null
  }
}

// ---------------------------------------------------------------------------
// HTML → editor de Payload (Lexical)
// ---------------------------------------------------------------------------

const FORMAT = { bold: 1, italic: 2, underline: 8 }

type LexicalNode = Record<string, unknown>

const textNode = (text: string, format: number): LexicalNode => ({
  type: 'text',
  text,
  format,
  style: '',
  mode: 'normal',
  detail: 0,
  version: 1,
})

const paragraphNode = (children: LexicalNode[]): LexicalNode => ({
  type: 'paragraph',
  children,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  textFormat: 0,
  textStyle: '',
})

const mediaBlockNode = (mediaId: number): LexicalNode => ({
  type: 'block',
  version: 2,
  format: '',
  fields: {
    id:
      Math.random().toString(16).slice(2, 14).padEnd(12, '0') + Date.now().toString(16).slice(-12),
    blockName: '',
    blockType: 'mediaBlock',
    media: mediaId,
  },
})

/** Convierte los nodos en línea (texto, cursivas, negritas, enlaces, <br>) de un párrafo. */
const inlineNodes = (node: Node, format = 0): LexicalNode[] => {
  const out: LexicalNode[] = []
  node.childNodes.forEach((child) => {
    if (child.nodeType === 3) {
      const text = (child.textContent ?? '').replace(/ /g, ' ')
      if (text) out.push(textNode(text, format))
      return
    }
    if (child.nodeType !== 1) return
    const el = child as Element
    const tag = el.tagName.toLowerCase()
    if (tag === 'br') out.push({ type: 'linebreak', version: 1 })
    else if (tag === 'em' || tag === 'i') out.push(...inlineNodes(el, format | FORMAT.italic))
    else if (tag === 'strong' || tag === 'b') out.push(...inlineNodes(el, format | FORMAT.bold))
    else if (tag === 'u') out.push(...inlineNodes(el, format | FORMAT.underline))
    else if (tag === 'a' && el.getAttribute('href')) {
      out.push({
        type: 'link',
        version: 3,
        format: '',
        indent: 0,
        direction: 'ltr',
        fields: { linkType: 'custom', url: el.getAttribute('href'), newTab: true },
        children: inlineNodes(el, format),
      })
    } else if (tag !== 'img') out.push(...inlineNodes(el, format))
  })
  return out
}

const isBlank = (nodes: LexicalNode[]) =>
  nodes.every((n) => n.type === 'linebreak' || (n.type === 'text' && !String(n.text).trim()))

type Converted = { root: LexicalNode; plainText: string }

const htmlToLexical = async (
  payload: Payload,
  html: string,
  title: string,
  featuredUrl: string | null,
): Promise<Converted> => {
  const { document } = new JSDOM(`<body>${html}</body>`).window
  const children: LexicalNode[] = []
  const plain: string[] = []
  const featuredKey = featuredUrl
    ? path.basename(featuredUrl).replace(/-\d+x\d+(\.\w+)$/, '$1')
    : null
  let photoNumber = 0
  let first = true

  for (const block of Array.from(document.body.children)) {
    // Fotos del bloque (pueden venir solas o dentro de <p>/<figure>)
    for (const img of Array.from(block.querySelectorAll('img')) as HTMLImageElement[]) {
      const url = fullSizeUrl(img)
      // La foto destacada ya va como "Imagen principal": no se repite dentro del texto
      if (featuredKey && path.basename(url) === featuredKey) continue
      photoNumber++
      const alt = img.getAttribute('alt')?.trim() || `${title} (foto ${photoNumber})`
      const mediaId = await ensureMedia(payload, url, alt)
      if (mediaId) children.push(mediaBlockNode(mediaId))
    }

    const nodes = inlineNodes(block)
    if (isBlank(nodes)) continue

    const text = nodes.map((n) => (n.type === 'text' ? n.text : '')).join('')
    // El primer párrafo suele repetir el titular en mayúsculas: se omite
    if (first && normalize(text) === normalize(title)) {
      first = false
      continue
    }
    first = false

    children.push(paragraphNode(nodes))
    plain.push(text)
  }

  return {
    root: { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children } },
    plainText: plain.join(' '),
  }
}

// ---------------------------------------------------------------------------
// Importación
// ---------------------------------------------------------------------------

const importPost = async (payload: Payload, post: WPPost) => {
  const originalTitle = decodeEntities(post.title.rendered).trim()
  const title = toSentenceCase(originalTitle)

  // Foto destacada
  let heroImage: number | null = null
  let featuredUrl: string | null = null
  if (post.featured_media) {
    try {
      const media = await fetchJson<WPMedia>(
        `${WP_API}/media/${post.featured_media}?_fields=id,source_url,alt_text`,
      )
      featuredUrl = media.source_url
      heroImage = await ensureMedia(payload, media.source_url, media.alt_text?.trim() || title)
    } catch (error) {
      payload.logger.warn(`  ⚠ Sin foto destacada: ${(error as Error).message}`)
    }
  }

  const { root: content, plainText } = await htmlToLexical(
    payload,
    post.content.rendered,
    originalTitle,
    featuredUrl,
  )

  // Extracto: el de WordPress sin el titular repetido; si no, el inicio del texto
  let excerpt = decodeEntities(post.excerpt.rendered)
    .replace(/\s*\[…\]|\s*\[&hellip;\]|\s*…\s*$/g, '')
    .trim()
  if (normalize(excerpt).startsWith(normalize(originalTitle))) {
    excerpt = excerpt
      .slice(originalTitle.length)
      .replace(/^[\s”"•:.-]+/, '')
      .trim()
  }
  if (!excerpt) excerpt = plainText
  if (excerpt.length > 280) excerpt = excerpt.slice(0, 277).replace(/\s+\S*$/, '') + '…'

  const data = {
    title,
    slug: post.slug,
    excerpt,
    content,
    publishedAt: new Date(`${post.date_gmt}Z`).toISOString(),
    _status: 'published' as const,
    ...(heroImage ? { heroImage } : {}),
    meta: {
      title,
      description: excerpt.slice(0, 160),
      ...(heroImage ? { image: heroImage } : {}),
    },
  }

  const existing = await payload.find({
    collection: 'posts',
    where: { slug: { equals: post.slug } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'posts',
      id: existing.docs[0].id,
      data,
      context: { disableRevalidate: true },
    })
    return 'actualizada'
  }

  await payload.create({
    collection: 'posts',
    // @ts-expect-error el editor acepta el JSON de Lexical generado
    data,
    context: { disableRevalidate: true },
  })
  return 'creada'
}

const run = async () => {
  const payload = await getPayload({ config })
  const started = Date.now()
  let processed = 0
  let failures = 0
  let index = 0
  let page = Math.floor(offset / PER_PAGE) + 1
  let skip = offset % PER_PAGE

  payload.logger.info(
    `Importando ${limit === Infinity ? 'todas las' : limit} notas desde WordPress${since ? ` publicadas desde el ${since}` : ''} (offset ${offset})…`,
  )

  while (processed + failures < limit) {
    const posts = await fetchJson<WPPost[]>(
      `${WP_API}/posts?per_page=${PER_PAGE}&page=${page}&orderby=date&order=desc${since ? `&after=${since}T00:00:00` : ''}&_fields=id,date_gmt,slug,title,content,excerpt,featured_media`,
    ).catch((error) => {
      // WordPress responde 400 al pedir una página que no existe: fin del archivo
      if (String(error.message).startsWith('400')) return [] as WPPost[]
      throw error
    })
    if (!posts.length) break

    for (const post of posts.slice(skip)) {
      if (processed + failures >= limit) break
      index++
      try {
        const result = await importPost(payload, post)
        processed++
        payload.logger.info(`[${offset + index}] ${result}: ${post.slug}`)
      } catch (error) {
        failures++
        payload.logger.error(
          `[${offset + index}] ERROR en ${post.slug}: ${(error as Error).message}`,
        )
      }
    }
    skip = 0
    page++
  }

  fs.rmSync(tmpDir, { recursive: true, force: true })
  const minutes = ((Date.now() - started) / 60000).toFixed(1)
  payload.logger.info(
    `Listo: ${processed} notas importadas, ${failures} con error, en ${minutes} min.`,
  )
  process.exit(failures ? 1 : 0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
