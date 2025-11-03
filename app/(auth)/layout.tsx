// app/layout.tsx
import { Suspense } from "react"
import "../../app/globals.css"

export const metadata = {
  title: "Vape Me",
  description: "Login and management panel",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
      <Suspense fallback={<div>Loading...</div>}>

        {children}
        </Suspense>
        </body>
    </html>
  )
}
