import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { SolanaWalletProvider } from "@/context/WalletContext";
import { PrivyProvider } from "@/providers/privy";
import { MongoClient } from "mongodb";

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
};


const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor, define la variable de entorno MONGODB_URI dentro de .env.local');
}

async function connectToDatabase() {
  if (clientPromise) {
    return clientPromise;
  }

  try {
    client = new MongoClient(uri!, options);
    clientPromise = client.connect();
    // Espera a que la conexión se establezca
    await clientPromise;
    return clientPromise;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  let isConnected = false;

  try {
    const client = await connectToDatabase();
    isConnected = !!client.db(process.env.MONGODB_DB); // Intenta acceder a la base de datos
  } catch (e) {
    console.error("Error al conectar a la base de datos:", e);
    isConnected = false;
  }

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <PrivyProvider>
        <SolanaWalletProvider>

            <CartProvider>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </CartProvider>

        </SolanaWalletProvider>
      </PrivyProvider>
    </body>
    </html >
  );
}
