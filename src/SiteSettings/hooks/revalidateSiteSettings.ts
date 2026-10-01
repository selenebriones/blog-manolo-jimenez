import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

/** El título y la descripción van en todas las páginas: se regenera el sitio completo. */
export const revalidateSiteSettings: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating site settings')
    revalidateTag('global_site-settings', { expire: 0 })
    revalidatePath('/', 'layout')
  }
  return doc
}
