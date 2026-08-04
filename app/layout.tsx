import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Inter, Poppins } from "next/font/google"
import { I18nProvider } from "@/lib/i18n"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "FindB Europa - Comunidades brasileiras na Europa",
  description:
    "Junte-se à FindB Europa: comunidades brasileiras em países europeus. Grupos, empregos, moradias, networking, eventos e muito mais.",
  keywords: [
    "FindB Europa",
    "brasileiros na Europa",
    "comunidade brasileira",
    "networking",
    "empregos Europa",
    "moradias Europa",
  ],
  openGraph: {
    title: "FindB Europa - Comunidades brasileiras na Europa",
    description: "Construindo relacionamentos saudáveis. Junte-se a nós.",
    type: "website",
  },
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f8f7ff",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        <I18nProvider>{children}</I18nProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
