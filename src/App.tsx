import './global.css'

import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/theme/theme-provider'

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey='financeiro-theme' defaultTheme='dark'>
        <Helmet titleTemplate='%s | Financeiro'/>
        <Toaster richColors/>
        <RouterProvider router={router} />
      </ThemeProvider>
    </HelmetProvider>
  )
}