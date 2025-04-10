"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { 
  ConnectionProvider, 
  WalletProvider, 
  useWallet,
  // useConnection 
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter, 
  CloverWalletAdapter, 
  Coin98WalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { 
  clusterApiUrl, 
  PublicKey, 
  Connection, 
  Transaction, 
  // SystemProgram, 
  // LAMPORTS_PER_SOL 
} from "@solana/web3.js";

// Estilos por defecto
import "@solana/wallet-adapter-react-ui/styles.css";

// Definir el contexto personalizado de wallet para exponer funcionalidades específicas
interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  walletName: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | null>(null);

// Hook personalizado para acceder al contexto de wallet
export const useCustomWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useCustomWallet debe ser usado dentro de un CustomWalletProvider");
  }
  return context;
};

// Componente proveedor custom que se conectará con el proveedor del adapter
const CustomWalletProvider = ({ children }: { children: ReactNode }) => {
  const { 
    connected, 
    connecting, 
    publicKey, 
    wallet, 
    connect: connectWallet, 
    disconnect: disconnectWallet 
  } = useWallet();

  const [isConnected, setIsConnected] = useState(connected);

  // Actualizar estado local cuando cambia el estado del wallet
  useEffect(() => {
    setIsConnected(connected);
  }, [connected]);

  // Función para conectar wallet (simplificada para el ejemplo)
  const connect = async () => {
    try {
      console.log("connect")
      if (wallet) {
        await connectWallet();
        return;
      }
      
      // Si no hay wallet seleccionada, intentamos con Phantom por defecto
      // const phantomWallet = window.solana?.isPhantom;
      // if (phantomWallet) {
      //   const phantomWalletName = 'Phantom' as WalletName;
      //   select(phantomWalletName);
      //   setTimeout(() => connectWallet(), 100);
      // }
    } catch (error) {
      console.error("Error al conectar wallet:", error);
    }
  };

  // Función para desconectar wallet
  const disconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Error al desconectar wallet:", error);
    }
  };

  // Función para enviar transacción utilizando la wallet conectada
  const sendTransaction = async (transaction: Transaction, connection: Connection): Promise<string> => {
    try {
      if (!connected || !publicKey || !wallet) {
        throw new Error("Wallet no conectada");
      }
      
      // Establecer el pagador de la transacción si no está establecido
      if (!transaction.feePayer) {
        transaction.feePayer = publicKey;
      }
      
      // Obtener el último blockhash si no está establecido
      if (!transaction.recentBlockhash) {
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
      }
      
      // Enviar la transacción utilizando el adaptador de wallet
      const signature = await wallet.adapter.sendTransaction(transaction, connection);
      
      // Confirmar la transacción
      await connection.confirmTransaction(signature, 'confirmed');
      
      console.log(`Transacción enviada con éxito: ${signature}`);
      return signature;
    } catch (error) {
      console.error("Error al enviar transacción:", error);
      throw error;
    }
  };

  // Valores que expondremos en el contexto
  const contextValue = {
    connected: isConnected,
    connecting,
    publicKey: publicKey,
    walletName: wallet?.adapter.name || null,
    connect,
    disconnect,
    sendTransaction
  };

  

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// Proveedor principal que envuelve tanto los adapters de Solana como nuestro contexto personalizado
export const SolanaWalletProvider = ({ children }: { children: ReactNode }) => {
  // Configuración de la red (mainnet, testnet, devnet, etc.)
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Configurar wallets soportados
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CloverWalletAdapter(),
      new Coin98WalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter()
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <CustomWalletProvider>
            {children}
          </CustomWalletProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}; 