import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import client from "@/lib/mongodb";
import { AppProviders } from "@/components/layout/AppProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GOING",
  description: "Compra y vende productos utilizando Solana y otras formas de pago",
  icons: {
    icon: ['/favicon.ico']
  },

};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  client.db(process.env.MONGODB_DB); // Intenta acceder a la base de datos


  return (
    <html lang="es">
      <head>
        {/* Open Graph */}
        <meta property="og:title" content="GOING — The Decentralized Marketplace" />
        <meta property="og:description" content="Experience the future of commerce with GOING. Try the live demo now." />
        <meta property="og:image" content="/public/goingLogo.png"/>
        <meta property="og:url" content="https://going-taupe.vercel.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GOING — The Decentralized Marketplace" />
        <meta name="twitter:description" content="Experience the future of commerce with GOING. Try the live demo now." />
        <meta name="twitter:image" content="/public/goingLogo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AppProviders>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html >
  );
}
