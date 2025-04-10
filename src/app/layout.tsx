import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { SolanaWalletProvider } from "@/context/WalletContext";
import { PaymentProvider } from "@/context/PaymentContext";
import { PrivyProvider } from "@/providers/privy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolMarket - Marketplace con Solana",
  description: "Compra y vende productos utilizando Solana y otras formas de pago",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <PrivyProvider>
        <SolanaWalletProvider>
          <PaymentProvider>
            <CartProvider>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </PaymentProvider>
        </SolanaWalletProvider>
      </PrivyProvider>
    </body>
    </html >
  );
}
