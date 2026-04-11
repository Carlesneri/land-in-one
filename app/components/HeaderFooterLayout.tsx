import { Header } from "@/app/components/Header"
import { Footer } from "@/app/components/Footer"

export function HeaderFooterLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className="flex-1 w-full py-8 sm:py-12">{children}</main>
      <Footer />
    </>
  )
}
