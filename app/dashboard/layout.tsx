import { HeaderFooterLayout } from "@/app/components/HeaderFooterLayout"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <HeaderFooterLayout>{children}</HeaderFooterLayout>
}
