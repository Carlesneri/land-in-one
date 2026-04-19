import type { Metadata } from "next"
import { Poppins, Inter } from "next/font/google"
import "@/app/globals.css"
import { AuthProvider } from "@/app/providers/AuthProvider"
import { Toaster } from "sonner"
import { HeaderFooterLayout } from "@/app/components/HeaderFooterLayout"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Land In One",
  description: "Create a landing page in less than one minute.",
  icons: {
    icon: "/logo.svg",
  },
  other: {
    "mobile-web-app-capable": "no",
    "apple-mobile-web-app-capable": "no",
  },
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="+cJiK6TTtfVKEMkl7IKP5A"
          async
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <AuthProvider>
          <HeaderFooterLayout>
            <Toaster position="top-right" richColors closeButton />
            {children}
          </HeaderFooterLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
