// src/components/layout/ClientThemeProvider.tsx
'use client'; // Marca este componente como un componente de cliente

import { useEffect, useState, ReactNode } from 'react';
import { ThemeProvider } from '@material-tailwind/react';

/**
 * Componente envoltorio para ThemeProvider de Material Tailwind.
 * Asegura que ThemeProvider solo se renderice en el lado del cliente
 * después de la hidratación inicial, lo que puede ayudar a prevenir
 * errores de "Maximum call stack size exceeded" relacionados con SSR/hidratación.
 */
export function ClientThemeProvider({ children }: { children: ReactNode }) {
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

  // Si estamos en el cliente, renderizamos el ThemeProvider de Material Tailwind
  return <ThemeProvider>{children}</ThemeProvider>;
}
