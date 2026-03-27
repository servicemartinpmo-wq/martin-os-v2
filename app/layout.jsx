import '../src/index.css'
import '../src/App.css'

export const metadata = {
  title: 'MARTIN OS',
  description: 'Tri-native business operating shell',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
