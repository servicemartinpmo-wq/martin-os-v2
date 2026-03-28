/* Global styles: src/index.css (Tailwind entry). The production app is Next.js App Router (app/). */
import '../src/index.css'
import { AppProviders } from './providers'

export const metadata = {
  title: 'Martin OS',
  description: 'PMO-Ops, Tech-Ops, and Miidle unified command environment.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-dvh overflow-hidden antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
