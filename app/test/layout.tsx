import type React from "react"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen m-0 p-0">
        {children}
      </body>
    </html>
  )
}
