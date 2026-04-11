import { HeaderFooterLayout } from "@/app/components/HeaderFooterLayout"

export default function BuilderLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <HeaderFooterLayout>{children}</HeaderFooterLayout>
}
