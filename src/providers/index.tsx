import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'

// El ThemeProvider (claro/oscuro) de la plantilla se retiró: el sitio usa solo tema claro.
export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return <HeaderThemeProvider>{children}</HeaderThemeProvider>
}
