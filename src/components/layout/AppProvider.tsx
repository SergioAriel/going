// src/components/layout/AppProviders.tsx
'use client'; // This marks the component as a Client Component

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from '@material-tailwind/react';
import { PrivyProvider } from '@/providers/privy';
import { AlertProvider } from '@/context/AlertContext';
import { UserProvider } from '@/context/UserContext';
import { CurrenciesProvider } from '@/context/CurrenciesContext';
import { CartProvider } from '@/context/CartContext';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  // Estado para controlar si el componente se ha montado en el cliente
  const [isClient, setIsClient] = useState(false);

  // useEffect se ejecuta solo en el lado del cliente después del primer renderizado
  useEffect(() => {
    setIsClient(true); // Una vez montado en el cliente, actualiza el estado a true
  }, []); // El array de dependencias vacío asegura que se ejecute solo una vez

  // Si no estamos en el cliente (ej. durante el SSR), no renderizamos nada
  if (!isClient) {
    return null;
  }

  return (
    <PrivyProvider>
      <ThemeProvider>
        <UserProvider>
          <CurrenciesProvider>
            <AlertProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </AlertProvider>
          </CurrenciesProvider>
        </UserProvider>
      </ThemeProvider>
    </PrivyProvider>
  );
};
