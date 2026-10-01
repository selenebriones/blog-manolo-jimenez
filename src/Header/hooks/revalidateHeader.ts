import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    // expire: 0 → quien edita ve el cambio en la siguiente carga (sin servir la versión anterior)
    revalidateTag('global_header', { expire: 0 })
  }

  return doc
}
