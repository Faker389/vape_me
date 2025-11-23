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
      <body className={`font-sans antialiased min-h-[100dvh] overflow-x-hidden`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
