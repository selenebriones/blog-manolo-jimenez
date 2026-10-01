import { APIError, type CollectionBeforeOperationHook } from 'payload'

/**
 * Impide reemplazar el archivo de una foto que ya existe en Medios.
 *
 * Cada foto de Medios se comparte: noticias, páginas, galería y portada guardan un enlace al
 * mismo registro. Reemplazar su archivo cambiaba la foto en TODOS esos lugares a la vez
 * (pasó con la foto de la noticia del IMCO). Para cambiar la foto de una sola sección hay que
 * subir un archivo nuevo desde esa sección.
 *
 * Los scripts de mantenimiento pueden saltarse el bloqueo con `context: { allowFileReplacement: true }`.
 *
 * Solo se bloquea el reemplazo del archivo; texto alternativo, crédito, pie y punto focal
 * se siguen editando normalmente.
 */
export const preventFileReplacement: CollectionBeforeOperationHook = ({ operation, req }) => {
  // Excepción solo para scripts del servidor (Local API con `context`); el admin no puede activarla
  if (req.context?.allowFileReplacement === true) return

  if ((operation === 'update' || operation === 'updateByID') && req.file) {
    throw new APIError(
      'No se puede reemplazar el archivo de una foto existente, porque cambiaría en todas las secciones donde se usa. Para usar otra foto, quítala de la sección y sube un archivo nuevo ("Crear nuevo").',
      400,
      null,
      true,
    )
  }
}
