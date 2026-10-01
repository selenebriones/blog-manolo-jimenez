/**
 * Sistema de diseño — Manolo Jiménez
 *
 * Tailwind v4 lee este archivo desde `globals.css` (`@config`), así que todo lo que
 * se define aquí queda disponible como utilidades (`bg-brand`, `text-ink`, etc.).
 *
 * Paleta oficial:
 * ┌──────────┬──────────┬──────────────────────────────────────────────────────────────┐
 * │ Token    │ Hex      │ Uso                                                          │
 * ├──────────┼──────────┼──────────────────────────────────────────────────────────────┤
 * │ ink      │ #232323  │ Texto principal: párrafos y encabezados.                     │
 * │ surface  │ #f5f5f5  │ Fondos de sección, tarjetas y fondo global secundario.       │
 * │ brand    │ #077d98  │ Primario: navbar, botones principales, enlaces, jerarquía.   │
 * │ leaf     │ #00ae4b  │ Secundario: CTAs secundarios y etiquetas de categoría.       │
 * │ alert    │ #f72828  │ Destacado 1: "Última hora", urgencia, iconos.                │
 * │ sun      │ #f1ae12  │ Destacado 2: subrayados decorativos, iconos de información.  │
 * └──────────┴──────────┴──────────────────────────────────────────────────────────────┘
 *
 * Regla de uso: los acentos (leaf, alert, sun) guían la vista; no se usan como fondo de
 * secciones grandes. Las variantes `dark` sirven para hover/pressed y `light` para
 * fondos tenues de badges, siempre derivadas del mismo tono.
 *
 * Nota: los nombres `primary`, `secondary`, `accent`… ya los usan los componentes de
 * shadcn/ui vía variables CSS (ver `globals.css`, donde apuntan a esta misma paleta),
 * por eso la paleta de marca usa nombres propios y no los sobrescribe.
 */

/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#232323',
          muted: '#5c5c5c', // texto secundario (fechas, metadatos) con contraste AA sobre blanco
        },
        surface: {
          DEFAULT: '#f5f5f5',
        },
        brand: {
          DEFAULT: '#077d98',
          dark: '#05637a',
          light: '#e6f2f5',
        },
        leaf: {
          DEFAULT: '#00ae4b',
          dark: '#00753a', // texto sobre leaf.light con contraste AA
          light: '#e5f7ed',
        },
        alert: {
          DEFAULT: '#f72828',
          dark: '#c21a1a',
          light: '#fee9e9',
        },
        sun: {
          DEFAULT: '#f1ae12',
          dark: '#8f6500', // texto sobre sun.light con contraste AA
          light: '#fdf5e1',
        },
      },
      fontFamily: {
        // Variables definidas con next/font en `src/app/(frontend)/layout.tsx`
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        // Sombra suave de las tarjetas de noticia y su estado hover
        card: '0 1px 2px rgb(35 35 35 / 0.04), 0 4px 16px rgb(35 35 35 / 0.06)',
        'card-hover': '0 2px 4px rgb(35 35 35 / 0.06), 0 12px 32px rgb(35 35 35 / 0.12)',
      },
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': '#232323',
              '--tw-prose-headings': '#232323',
              '--tw-prose-links': '#077d98',
              '--tw-prose-bullets': '#077d98',
              '--tw-prose-quote-borders': '#f1ae12',
              h1: {
                fontWeight: '700',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      },
    },
  },
}

export default config
