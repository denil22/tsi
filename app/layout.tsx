import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'VELCOR3',
  description: "Velcorians is where alpha is born and you're connected before it trends.",
  keywords: ['velist', 'landing page', 'gaming'],
  authors: [{ name: 'Velist' }],
  icons: {
    icon: '/images/sitelogo.jpg',
    shortcut: '/images/sitelogo.jpg',
    apple: '/images/sitelogo.jpg',
  },
  openGraph: {
    title: 'VELCOR3',
    description: "Velcorians is where alpha is born and you're connected before it trends.",
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'VELCOR3',
    images: [
      {
        url: '/images/content.png',
        width: 1200,
        height: 630,
        alt: 'VELCOR3',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VELCOR3',
    description: "Velcorians is where alpha is born and you're connected before it trends.",
    images: [
      {
        url: '/images/content.png',
        width: 1200,
        height: 630,
        alt: 'VELCOR3',
      },
    ],
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
