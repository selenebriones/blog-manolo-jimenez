/**
 * Conversión de titulares de MAYÚSCULAS a formato oración para el importador de WordPress,
 * respetando nombres propios y siglas.
 */
/**
 * Nombres propios que deben conservar su forma. Ampliar según haga falta.
 * Ojo: no incluir nombres que también son palabras comunes ("Progreso", "Frontera", "Mejora"…),
 * porque se pondrían en mayúscula en cualquier titular.
 */
const PROPER_NOUNS = [
  // Personas
  'Manolo',
  'Jiménez',
  'Salinas',
  'Paola',
  'Rodríguez',
  'Riquelme',
  'Miguel',
  'Claudia',
  'Sheinbaum',
  'Andrés',
  'Manuel',
  'López',
  'Obrador',
  'Greg',
  'Abbott',
  'Omar García Harfuch',
  'García Harfuch',
  'Harfuch',
  // Lugares
  'Coahuila',
  'Zaragoza',
  'Saltillo',
  'Torreón',
  'Monclova',
  'Piedras Negras',
  'Acuña',
  'Ciudad Acuña',
  'Sabinas',
  'Múzquiz',
  'Parras',
  'Ramos Arizpe',
  'Arteaga',
  'San Pedro',
  'Matamoros',
  'Francisco I. Madero',
  'San Buenaventura',
  'Nava',
  'Allende',
  'Castaños',
  'Cuatro Ciénegas',
  'General Cepeda',
  'Viesca',
  'Ocampo',
  'Nadadores',
  'Lamadrid',
  'Escobedo',
  'Juárez',
  'Guerrero',
  'Hidalgo',
  'Jiménez',
  'Morelos',
  'Villa Unión',
  'Zaragoza',
  'Abasolo',
  'Sierra Mojada',
  'La Laguna',
  'Laguna',
  'Región Sureste',
  'Región Norte',
  'Región Centro',
  'Región Carbonífera',
  'Región Laguna',
  'Región Desierto',
  'Texas',
  'Austin',
  'México',
  'Ciudad de México',
  'Estados Unidos',
  'Nuevo León',
  'Chihuahua',
  'Durango',
  'Tamaulipas',
  'Monterrey',
  'Canadá',
  'China',
  'Japón',
  'Corea',
  'Alemania',
  'Shenzhen',
  'América del Norte',
  // Instituciones y programas
  'Gobierno del Estado',
  'Gobierno de México',
  'Gobierno Federal',
  'Coahuila Pa’ Delante',
  'Pa’ Delante',
  "Pa' Delante",
  'Policía Violeta',
  'Salud Popular',
  'Congreso',
  'Sedena',
  'Guardia Nacional',
  'North Capital Forum',
  'General Motors',
  'Stellantis',
  'Siemens',
]

/** Siglas: van en mayúsculas completas. */
const ACRONYMS = [
  'IMCO',
  'IP',
  'ISN',
  'DIF',
  'IMSS',
  'ISSSTE',
  'CDMX',
  'SEP',
  'CFE',
  'OCDE',
  'INEGI',
  'PROCOAHUILA',
  'ONG',
  'ONGS',
  'T-MEC',
  'EUA',
  'USA',
  'UANE',
  'UAdeC',
  'UA de C',
  'SNTE',
  'CONAGUA',
  'INE',
  'FGE',
  'PGJE',
  'SSP',
  'C5',
  'C4',
  'PRI',
  'MORENA',
  'PVEM',
  'ITESM',
  'IMPI',
  'SAT',
  'BID',
  'ONU',
  'COVID',
  'COVID-19',
  'UNESCO',
  'FIFA',
  'NFL',
  'MLB',
  'LMB',
  'PYMES',
  'MIPYMES',
]

/** "mdp" y similares van en minúsculas aunque vengan en mayúsculas. */
const LOWERCASE = ['mdp', 'mdd', 'km', 'kg']

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const toSentenceCase = (input: string): string => {
  let text = input.toLocaleLowerCase('es-MX').replace(/\s+/g, ' ').trim()

  // Primera letra (después de comillas o signos iniciales) en mayúscula
  text = text.replace(
    /^([^\p{L}\d]*)(\p{L})/u,
    (_, lead, letter) => lead + letter.toLocaleUpperCase('es-MX'),
  )

  // Nombres propios (los más largos primero, para "Ciudad de México" antes que "México")
  const nouns = [...new Set(PROPER_NOUNS)].sort((a, b) => b.length - a.length)
  for (const noun of nouns) {
    const pattern = new RegExp(
      `(?<![\\p{L}])${escapeRegex(noun.toLocaleLowerCase('es-MX'))}(?![\\p{L}])`,
      'gu',
    )
    text = text.replace(pattern, noun)
  }
  for (const acronym of ACRONYMS) {
    const pattern = new RegExp(
      `(?<![\\p{L}])${escapeRegex(acronym.toLocaleLowerCase('es-MX'))}(?![\\p{L}])`,
      'gu',
    )
    text = text.replace(pattern, acronym)
  }
  for (const word of LOWERCASE) {
    const pattern = new RegExp(`(?<![\\p{L}])${escapeRegex(word)}(?![\\p{L}])`, 'giu')
    text = text.replace(pattern, word)
  }

  // Comillas desbalanceadas (en el sitio anterior hay titulares con solo la de cierre)
  const opening = (text.match(/[“"]/g) ?? []).length
  const closing = (text.match(/”/g) ?? []).length
  if (closing > 0 && opening === 0) text = `“${text}`

  return text
}

