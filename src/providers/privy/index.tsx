'use client';

import { PrivyProvider as Privy } from '@privy-io/react-auth';
import {toSolanaWalletConnectors} from "@privy-io/react-auth/solana";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
    return (
        <Privy
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
            clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID as string}
            config={{
                solanaClusters: [{name: 'devnet', rpcUrl: 'https://api.devnet.solana.com'}],
                // Customize Privy's appearance in your app
                appearance: {
                    theme: 'light',
                    accentColor: '#676FFF',
                    logo: '/goingLogo.svg',
                    walletChainType: 'solana-only'
                },
                // Create embedded wallets for users who don't have a wallet
                externalWallets: {
                    solana: { connectors: toSolanaWalletConnectors() },
                }
            }}
        >
            {children}
        </Privy>
    );
}