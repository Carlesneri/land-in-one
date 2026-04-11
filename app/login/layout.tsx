import { HeaderFooterLayout } from "@/app/components/HeaderFooterLayout"

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <HeaderFooterLayout>{children}</HeaderFooterLayout>
}
