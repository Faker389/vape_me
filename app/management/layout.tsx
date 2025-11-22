import "../../app/globals.css";
export const metadata = {
  title: 'Vape me - management',
  description: 'Your vape shop description',
}

export default function SpecialLayout({ children }: { children: React.ReactNode }) {
    return <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
      </body></html>
  }
  