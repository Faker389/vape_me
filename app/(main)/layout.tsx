import type React from "react"
import ClientLayout from "./clientLayout"

export const dynamic = "force-dynamic"
export const metadata = {
  title: 'Vape me - home',
  description: 'Your vape shop description',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
      <body className={`font-sans antialiased min-h-[100dvh] overflow-x-hidden`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
