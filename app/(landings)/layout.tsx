import type { Metadata } from "next"
import { Poppins, Inter } from "next/font/google"
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core"
import "@/app/globals.css"
import "@/app/landings.css"
import "@mantine/core/styles.css"

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
  icons: {
    icon: "/logo.svg",
  },
  other: {
    "mobile-web-app-capable": "no",
    "apple-mobile-web-app-capable": "no",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} antialiased`}
      data-scroll-behavior="smooth"
      {...mantineHtmlProps}
    >
      <head>
        <ColorSchemeScript />
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="+cJiK6TTtfVKEMkl7IKP5A"
          async
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  )
}
