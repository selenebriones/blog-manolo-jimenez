import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)

    // expire: 0 → quien edita ve el cambio en la siguiente carga (sin servir la versión anterior)
    revalidateTag('global_footer', { expire: 0 })
  }

  return doc
}
