import type { GlobalConfig } from 'payload'

import { normalizeInstagramUrl } from '@/utilities/instagram'

import { homePageDefaults as d } from './defaults'
import { revalidateHomePage } from './hooks/revalidateHomePage'

/**
 * Página de inicio: textos y secciones de la portada, organizados en pestañas.
 *
 * El diseño (orden de secciones, colores, tarjetas) es fijo a propósito para mantener
 * la línea institucional; aquí se edita el contenido y se prenden/apagan secciones.
 */
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Página de inicio',
  admin: {
    group: 'Configuración del sitio',
    description: 'Contenido de la portada. Los cambios se ven en el sitio al guardar.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'banner',
          label: 'Banner',
          description:
            'Imagen principal de la portada (campañas, fechas conmemorativas, anuncios). Tamaño recomendado: 2000 × 754 px.',
          fields: [
            {
              name: 'image',
              type: 'upload',
              label: 'Imagen del banner (escritorio)',
              relationTo: 'media',
              admin: {
                description:
                  'El texto alternativo de la imagen (en Medios) debe decir lo que dice el banner, para lectores de pantalla y buscadores.',
              },
            },
            {
              name: 'mobileImage',
              type: 'upload',
              label: 'Imagen para celular (opcional)',
              relationTo: 'media',
              admin: {
                description:
                  'Versión vertical o cuadrada (ej. 1080 × 1350 px). Si no se sube, se usa la de escritorio, cuyo texto se verá pequeño en celular.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  label: 'Enlace al hacer clic (opcional)',
                  admin: {
                    width: '70%',
                    description: 'Ruta interna (ej. /posts/mi-nota) o dirección completa.',
                  },
                },
                {
                  name: 'newTab',
                  type: 'checkbox',
                  label: 'Abrir en otra pestaña',
                  admin: { width: '30%', style: { alignSelf: 'center' } },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Mensaje de respaldo (cuando no hay banner cargado)',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'welcomeEyebrow',
                  type: 'text',
                  label: 'Texto superior',
                  defaultValue: d.banner.welcomeEyebrow,
                },
                {
                  name: 'welcomeTitle',
                  type: 'text',
                  label: 'Título',
                  defaultValue: d.banner.welcomeTitle,
                },
                {
                  name: 'welcomeText',
                  type: 'textarea',
                  label: 'Texto',
                  defaultValue: d.banner.welcomeText,
                },
              ],
            },
          ],
        },
        {
          name: 'highlights',
          label: 'Noticias destacadas',
          description: 'Las 3 noticias más recientes en mosaico, a todo lo ancho.',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Mostrar esta sección',
              defaultValue: d.highlights.enabled,
            },
            {
              name: 'title',
              type: 'text',
              label: 'Título (dentro de la cinta negra)',
              required: true,
              defaultValue: d.highlights.title,
            },
          ],
        },
        {
          name: 'ring',
          label: 'A pasos de gigante',
          description:
            'Foto en círculo con una frase que gira a su alrededor, junto a un texto de presentación. Se muestra justo después del banner.',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Mostrar esta sección',
              defaultValue: d.ring.enabled,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Frase que gira',
                  required: true,
                  maxLength: 40,
                  defaultValue: d.ring.text,
                  admin: {
                    width: '60%',
                    description:
                      'Se escribe en mayúsculas y se repite con "•" hasta cerrar el círculo. Frases cortas (hasta 40 caracteres) se leen mejor.',
                  },
                },
                {
                  name: 'speed',
                  type: 'select',
                  label: 'Velocidad del giro',
                  defaultValue: d.ring.speed,
                  options: [
                    { label: 'Lenta (30 s por vuelta)', value: 'slow' },
                    { label: 'Normal (20 s por vuelta)', value: 'normal' },
                    { label: 'Rápida (12 s por vuelta)', value: 'fast' },
                  ],
                  admin: { width: '40%' },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Texto (columna derecha)',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Título',
                  required: true,
                  defaultValue: d.ring.title,
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Subtítulo',
                  defaultValue: d.ring.subtitle,
                },
                {
                  name: 'content',
                  type: 'textarea',
                  label: 'Contenido',
                  defaultValue: d.ring.content,
                  admin: {
                    description:
                      'Un párrafo breve. Deja una línea en blanco para separar párrafos.',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'buttonLabel',
                      type: 'text',
                      label: 'Texto del botón',
                      defaultValue: d.ring.buttonLabel,
                      admin: { width: '40%', description: 'Déjalo vacío para ocultar el botón.' },
                    },
                    {
                      name: 'buttonUrl',
                      type: 'text',
                      label: 'Enlace del botón',
                      defaultValue: d.ring.buttonUrl,
                      admin: { width: '60%', description: 'Ruta interna, ej. /mi-historia.' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'image',
              type: 'upload',
              label: 'Foto del círculo',
              relationTo: 'media',
              admin: {
                description:
                  'Se recorta en círculo. En Medios, marca el punto focal sobre el rostro para centrarlo. Si no hay foto, la sección no se muestra.',
              },
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              label: 'Foto de la columna derecha (opcional)',
              relationTo: 'media',
              admin: {
                description:
                  'Ocupa toda la columna derecha, en blanco y negro. Sin foto, esa columna queda en azul tenue.',
              },
            },
          ],
        },
        {
          name: 'latest',
          label: 'Más noticias',
          description:
            'Cuadrícula de tarjetas. Continúa después de las 3 noticias destacadas, así no se repiten.',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Mostrar esta sección',
              defaultValue: d.latest.enabled,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  label: 'Texto superior',
                  defaultValue: d.latest.eyebrow,
                  admin: { width: '50%' },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Título',
                  required: true,
                  defaultValue: d.latest.title,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Descripción',
              defaultValue: d.latest.description,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'count',
                  type: 'select',
                  label: 'Cuántas noticias mostrar',
                  defaultValue: d.latest.count,
                  // En múltiplos de 3 la cuadrícula de 3 columnas queda completa; 10 deja una tarjeta en la última fila
                  options: ['3', '6', '9', '10', '12'].map((value) => ({ label: value, value })),
                  admin: { width: '50%' },
                },
                {
                  name: 'viewAllLabel',
                  type: 'text',
                  label: 'Texto del enlace "ver todas"',
                  defaultValue: d.latest.viewAllLabel,
                  admin: { width: '50%', description: 'Déjalo vacío para ocultarlo.' },
                },
              ],
            },
            {
              name: 'showExcerpt',
              type: 'checkbox',
              label: 'Mostrar el extracto en las tarjetas',
              defaultValue: d.latest.showExcerpt,
            },
          ],
        },
        {
          name: 'facebook',
          label: 'Facebook',
          description:
            'Publicaciones recientes de la página de Facebook (la liga se toma de Pie de página → Redes sociales).',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Mostrar esta sección',
              defaultValue: d.facebook.enabled,
            },
            {
              name: 'display',
              type: 'radio',
              label: '¿Cómo mostrar las publicaciones?',
              defaultValue: d.facebook.display,
              options: [
                {
                  label: 'Recuadro oficial de Facebook (funciona sin configuración)',
                  value: 'widget',
                },
                {
                  label: 'Tarjetas con el diseño del sitio (requiere la conexión con Meta)',
                  value: 'cards',
                },
              ],
              admin: {
                layout: 'vertical',
                description:
                  'Las tarjetas necesitan que el equipo técnico configure el acceso a la página. Mientras no esté, se muestra el recuadro oficial.',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Título',
              required: true,
              defaultValue: d.facebook.title,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Descripción',
              defaultValue: d.facebook.description,
            },
            {
              name: 'buttonLabel',
              type: 'text',
              label: 'Texto del botón a la página de Facebook',
              defaultValue: d.facebook.buttonLabel,
              admin: { description: 'Déjalo vacío para ocultar el botón.' },
            },
          ],
        },
        {
          name: 'instagram',
          label: 'Instagram',
          description:
            'Tres publicaciones de Instagram elegidas por el equipo, debajo de la sección de Facebook. El botón lleva al perfil de Pie de página → Redes sociales.',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Mostrar esta sección',
              defaultValue: d.instagram.enabled,
            },
            {
              name: 'title',
              type: 'text',
              label: 'Título',
              required: true,
              defaultValue: d.instagram.title,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Descripción',
              defaultValue: d.instagram.description,
            },
            {
              name: 'buttonLabel',
              type: 'text',
              label: 'Texto del botón al perfil de Instagram',
              defaultValue: d.instagram.buttonLabel,
              admin: { description: 'Déjalo vacío para ocultar el botón.' },
            },
            {
              name: 'posts',
              type: 'array',
              label: 'Publicaciones',
              labels: { singular: 'Publicación', plural: 'Publicaciones' },
              maxRows: 3,
              admin: {
                description:
                  'En Instagram, abre la publicación y copia la liga de la barra del navegador (o "…" → Copiar enlace). Sirven fotos, carruseles y Reels públicos.',
              },
              fields: [
                {
                  name: 'url',
                  type: 'text',
                  label: 'Liga de la publicación',
                  required: true,
                  validate: (value: string | null | undefined) =>
                    (value && normalizeInstagramUrl(value) !== null) ||
                    'Pega la liga de una publicación, ej. https://www.instagram.com/p/ABC123/',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHomePage],
  },
}
