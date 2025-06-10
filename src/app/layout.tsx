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
  description: "Experience the future of commerce with GOING.",
  icons: {
    icon: ['/favicon.ico']
  },
  openGraph: {
    title: 'GOING',
    description: 'Experience the future of commerce with GOING.',
    url: 'https://going-taupe.vercel.app/',
    siteName: 'GOING',
    images: [
      {
        url: 'https://going-taupe.vercel.app/goingLogo.png', // Must be an absolute URL
        width: 800,
        height: 600,
      }
    ],

    locale: 'en_US',
    type: 'website',
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
