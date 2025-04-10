"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface PaymentContextType {
  // Google Pay
  isGooglePayAvailable: boolean;
  loadGooglePay: () => Promise<boolean>;
  processGooglePayment: (amount: number) => Promise<string | null>;
  
  // Apple Pay
  isApplePayAvailable: boolean;
  loadApplePay: () => Promise<boolean>;
  processApplePayment: (amount: number) => Promise<string | null>;
  
  // Estados compartidos
  isProcessing: boolean;
  error: string | null;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment debe ser usado dentro de un PaymentProvider");
  }
  return context;
};

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar disponibilidad de Google Pay (normalmente, se haría a través de la API de Google Pay)
  const loadGooglePay = async () => {
    try {
      // Simulamos una detección basada en navegador
      // En una implementación real, usarías la API de Google Pay para esto
      const isGooglePaySupported = 
        navigator.userAgent.includes("Chrome") ||
        navigator.userAgent.includes("Android");

      setIsGooglePayAvailable(isGooglePaySupported);
      return isGooglePaySupported;
    } catch (error) {
      console.error("Error al verificar Google Pay:", error);
      setIsGooglePayAvailable(false);
      return false;
    }
  };

  // Verificar disponibilidad de Apple Pay (normalmente, se haría a través de la API de Apple Pay)
  const loadApplePay = async () => {
    try {
      // Simulamos una detección basada en navegador
      // En una implementación real, usarías la API de Apple Pay para esto
      const isApplePaySupported = 
        navigator.userAgent.includes("Safari") || 
        navigator.userAgent.includes("iPhone") || 
        navigator.userAgent.includes("iPad");

      setIsApplePayAvailable(isApplePaySupported);
      return isApplePaySupported;
    } catch (error) {
      console.error("Error al verificar Apple Pay:", error);
      setIsApplePayAvailable(false);
      return false;
    }
  };

  // Procesar pago con Google Pay
  const processGooglePayment = async (amount: number): Promise<string | null> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simular procesamiento de pago con Google Pay
      console.log(`Procesando pago de ${amount} con Google Pay`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulamos transacción exitosa con ID generado
      const transactionId = "GP_" + Math.random().toString(36).substring(2, 10).toUpperCase();
      return transactionId;
    } catch (error) {
      console.error("Error al procesar pago con Google Pay:", error);
      setError("No se pudo procesar el pago con Google Pay. Inténtalo de nuevo.");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Procesar pago con Apple Pay
  const processApplePayment = async (amount: number): Promise<string | null> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simular procesamiento de pago con Apple Pay
      console.log(`Procesando pago de ${amount} con Apple Pay`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulamos transacción exitosa con ID generado
      const transactionId = "AP_" + Math.random().toString(36).substring(2, 10).toUpperCase();
      return transactionId;
    } catch (error) {
      console.error("Error al procesar pago con Apple Pay:", error);
      setError("No se pudo procesar el pago con Apple Pay. Inténtalo de nuevo.");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const contextValue: PaymentContextType = {
    isGooglePayAvailable,
    loadGooglePay,
    processGooglePayment,
    
    isApplePayAvailable,
    loadApplePay,
    processApplePayment,
    
    isProcessing,
    error
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
}; 