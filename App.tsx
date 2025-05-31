import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PrivyProvider
      appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID as string}
      clientId={process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID as string}
      config={{
        solanaClusters: [{name: 'devnet', rpcUrl: 'https://api.devnet.solana.com'}],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          walletChainType: 'solana-only'
        },
        externalWallets: {
          solana: { connectors: toSolanaWalletConnectors() },
        }
      }}
    >
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </PrivyProvider>
  );
}