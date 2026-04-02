/* Global styles: martin-os-ui-new source-of-truth CSS */
import '../martin-os-ui-new/src/index.css'
import { AppProviders } from './providers'

const siteUrl =
  globalThis.process?.env?.NEXT_PUBLIC_APP_URL || 'https://os-martinpmo.com'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Martin OS',
    template: '%s | Martin OS',
  },
  description:
    'A friendly operating workspace for planning, support, studio work, and day-to-day follow-through.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Martin OS',
    description:
      'A friendly operating workspace for planning, support, studio work, and day-to-day follow-through.',
    url: siteUrl,
    siteName: 'Martin OS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Martin OS',
    description:
      'A friendly operating workspace for planning, support, studio work, and day-to-day follow-through.',
  },
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
