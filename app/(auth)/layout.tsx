// app/layout.tsx
import "../../app/globals.css"

export const metadata = {
  title: "Vape Me",
  description: "Login and management panel",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
