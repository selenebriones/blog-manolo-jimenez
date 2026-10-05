/**
 * Sube las fotos de Medios (public/media) a Vercel Blob, para producción.
 *
 * Uso:
 *   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_… npx tsx scripts/subir-fotos-a-blob.ts
 *   … --prueba    # solo cuenta lo que subiría, sin subir nada
 *
 * - Sube únicamente el original y la miniatura de cada foto registrada en la base de datos
 *   (las copias de otros tamaños que haya en la carpeta no se usan).
 * - Cada archivo va en la raíz del Blob con su mismo nombre: así lo busca el adaptador de Payload.
 * - Se puede correr varias veces: lo que ya está en Blob se salta. Importa porque el plan gratuito
 *   de Vercel limita las subidas al mes.
 */
import 'dotenv/config'

import { list, put } from '@vercel/blob'
import fs from 'fs/promises'
import path from 'path'
import pg from 'pg'

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) throw new Error('Falta BLOB_READ_WRITE_TOKEN')

const dryRun = process.argv.includes('--prueba')
const mediaDir = path.resolve(process.cwd(), 'public/media')
const CONCURRENCY = 6

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
const { rows } = await client.query<{ filename: string | null; thumb: string | null }>(
  'select filename, sizes_thumbnail_filename as thumb from media',
)
await client.end()

const wanted = [...new Set(rows.flatMap(({ filename, thumb }) => [filename, thumb]))].filter(
  (name): name is string => Boolean(name),
)

// Lo que ya está en Blob (1 consulta por cada 1,000 archivos)
const existing = new Set<string>()
let cursor: string | undefined
do {
  const page = await list({ cursor, limit: 1000, token })
  page.blobs.forEach((blob) => existing.add(blob.pathname))
  cursor = page.hasMore ? page.cursor : undefined
} while (cursor)

const pending: string[] = []
const missing: string[] = []
for (const name of wanted) {
  if (existing.has(name)) continue
  try {
    await fs.access(path.join(mediaDir, name))
    pending.push(name)
  } catch {
    missing.push(name)
  }
}

console.log(
  `Archivos necesarios: ${wanted.length} · ya en Blob: ${wanted.length - pending.length - missing.length} · por subir: ${pending.length} · no están en la carpeta: ${missing.length}`,
)
if (missing.length) console.log('Faltan en public/media:', missing.slice(0, 20).join(', '))
if (dryRun) process.exit(0)

let done = 0
const failed: string[] = []
const queue = [...pending]
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let name = queue.shift(); name; name = queue.shift()) {
      try {
        const buffer = await fs.readFile(path.join(mediaDir, name))
        await put(name, buffer, {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
          // Igual que el adaptador de Payload: un año en caché
          cacheControlMaxAge: 365 * 24 * 60 * 60,
          contentType: mimeTypes[path.extname(name).toLowerCase()] ?? 'application/octet-stream',
          token,
        })
        done++
        if (done % 100 === 0) console.log(`  ${done}/${pending.length}`)
      } catch (error) {
        failed.push(name)
        console.error(`  Error con ${name}:`, (error as Error).message)
      }
    }
  }),
)

console.log(`Listo: ${done} subidos, ${failed.length} con error.`)
