import "./globals.css";
export const metadata = {
  title: 'Vape me',
  description: 'Zdobywaj nagrody robiąc zakupy w programie lojalnościowym Vape Me. Ekskluzywne kupony, zniżki i nagrody za każdy zakup!',
  keywords: 'vape, program lojalnościowy, nagrody, zakupy, kupony, zniżki',
  authors: [{ name: 'Vape Me' }],
  openGraph: {
    title: 'Vape me - Program lojalnościowy',
    description: 'Zdobywaj nagrody robiąc zakupy w programie lojalnościowym Vape Me',
    type: 'website',
    url: 'https://vape-me-nu.vercel.app',
    siteName: 'Vape Me',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vape me - Program lojalnościowy',
    description: 'Zdobywaj nagrody robiąc zakupy',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function SpecialLayout({ children }: { children: React.ReactNode }) {
    return <html lang="pl" style={{ height: '100%', margin: 0, padding: 0 }} className="scroll-smooth">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, minimum-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Vape Me" />
        
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        
        <meta name="user-scalable" content="no" />
      </head>
      <body className="font-sans antialiased bg-[#0a0a0f]">
        {children}
      </body>
    </html>
  }