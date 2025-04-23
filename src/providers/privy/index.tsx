'use client';

import { PrivyProvider as Privy } from '@privy-io/react-auth';
import {toSolanaWalletConnectors} from "@privy-io/react-auth/solana";

export function PrivyProvider({ children }: { children: React.ReactNode }) {
    return (
        <Privy
            appId="cm98xfs1400p8jr0ko4qbl24q"
            clientId="client-WY5ijmFzEhrnzEojw1udsczNP1Rob52q5NX7CHFsRGX2k"
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