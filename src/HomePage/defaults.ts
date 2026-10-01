import type { HomePage } from '@/payload-types'

/**
 * Textos por defecto de la portada.
 * Se usan como `defaultValue` en el admin y como respaldo en el frontend,
 * así la portada se ve completa aunque el global aún no se haya guardado nunca.
 */
export const homePageDefaults = {
  banner: {
    welcomeEyebrow: 'Gobernador de Coahuila',
    welcomeTitle: 'Trabajando juntos por Coahuila',
    welcomeText: 'Noticias, propuestas y el trabajo de cada día en los 38 municipios del estado.',
  } satisfies Partial<NonNullable<HomePage['banner']>>,
  highlights: {
    enabled: true,
    title: "Coahuila Pa' Delante",
  } satisfies Partial<NonNullable<HomePage['highlights']>>,
  ring: {
    enabled: true,
    text: 'A PASOS DE GIGANTE',
    speed: 'normal',
    title: 'Soy Manolo Jiménez Salinas',
    subtitle: 'Muy Coahuilense, Norteño de Corazón y un papá orgulloso.',
    content:
      'Desde niño mis padres me enseñaron a trabajar con honestidad y a luchar por lo que uno ama. Valores que hoy comparto con mi esposa Paola y nuestros 4 hijos. Soy ingeniero y empresario. Llevo más de 15 años trabajando cerca de nuestra gente de las colonias, barrios y ejidos...',
    buttonLabel: 'Leer más',
    buttonUrl: '/mi-historia',
  } satisfies Partial<NonNullable<HomePage['ring']>>,
  latest: {
    enabled: true,
    eyebrow: 'Día a día',
    title: 'Más noticias',
    description: 'Anuncios, obras y el trabajo de cada día en Coahuila.',
    count: '9',
    showExcerpt: false,
    viewAllLabel: 'Ver todas las noticias',
  } satisfies Partial<NonNullable<HomePage['latest']>>,
  instagram: {
    enabled: true,
    title: 'Síguenos en Instagram',
    description: 'Fotos y videos del trabajo de cada día en Coahuila.',
    buttonLabel: 'Ir a Instagram',
  } satisfies Partial<NonNullable<HomePage['instagram']>>,
  facebook: {
    enabled: true,
    display: 'widget',
    title: 'Síguenos en Facebook',
    description: 'Lo más reciente de nuestras redes, cerca de la gente todos los días.',
    buttonLabel: 'Ir a Facebook',
  } satisfies Partial<NonNullable<HomePage['facebook']>>,
}
