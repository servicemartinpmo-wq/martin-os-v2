/* eslint-disable react-refresh/only-export-components */
import '../src/index.css'
import '../src/App.css'

export const metadata = {
  title: 'MARTIN OS Presence Layer',
  description: 'Luxury AI concierge interface shell',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
