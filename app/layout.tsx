import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Velist - Welcome',
  description: 'Experience the magic of Velist',
  keywords: ['velist', 'landing page', 'gaming'],
  authors: [{ name: 'Velist' }],
  openGraph: {
    title: 'Velist - Welcome',
    description: 'Experience the magic of Velist',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velist - Welcome',
    description: 'Experience the magic of Velist',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
