import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

/** Al guardar la Página de inicio se regenera la portada. */
export const revalidateHomePage: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating home page`)

    // expire: 0 → quien edita ve el cambio en la siguiente carga (sin servir la versión anterior)
    revalidateTag('global_home-page', { expire: 0 })
    revalidatePath('/')
  }

  return doc
}
