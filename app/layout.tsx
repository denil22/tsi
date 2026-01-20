import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VELCOR3',
  description: 'Velcorians is where alpha is born and you’re connected before it trends.',
  keywords: ['velist', 'landing page', 'gaming'],
  authors: [{ name: 'Velist' }],
  icons: {
    icon: '/images/sitelogo.jpg',
    shortcut: '/images/sitelogo.jpg',
    apple: '/images/sitelogo.jpg',
  },
  openGraph: {
    title: 'VELCOR3',
    description: 'Velcorians is where alpha is born and you’re connected before it trends.',
    type: 'website',
    images: ['/images/embed.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VELCOR3',
    description: 'Velcorians is where alpha is born and you’re connected before it trends.',
    images: ['/images/embed.png'],
  },
  other: {
    'cache-control': 'public, max-age=3600, must-revalidate',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
