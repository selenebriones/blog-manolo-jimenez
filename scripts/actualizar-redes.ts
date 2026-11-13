/**
 * Carga las 4 redes del gobernador en Pie de página → Redes sociales y cambia el título de la
 * sección del inicio a "Síguenos en redes sociales". Uso único (2026-11-13):
 *   npx tsx scripts/actualizar-redes.ts                     # base local (.env)
 *   DATABASE_URL=… NODE_ENV=production npx tsx scripts/…    # producción
 */
import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
const context = { disableRevalidate: true }

await payload.updateGlobal({
  slug: 'footer',
  context,
  data: {
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/Manolo.Jimenez.Salinas' },
      { platform: 'x', url: 'https://x.com/manolojim' },
      { platform: 'instagram', url: 'https://www.instagram.com/manolojimenezs' },
      { platform: 'tiktok', url: 'https://www.tiktok.com/@manolojimenezs' },
    ],
  },
})

const home = await payload.findGlobal({ slug: 'home-page', depth: 0 })
await payload.updateGlobal({
  slug: 'home-page',
  context,
  data: { facebook: { ...home.facebook, enabled: true, title: 'Síguenos en redes sociales' } },
})

console.log('OK')
process.exit(0)
