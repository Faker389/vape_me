// app/layout.tsx (server)
import ClientLayout from './clientLayout'

export const metadata = {
  title: 'Vape Me',
  description: 'Your vape shop description',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
}
