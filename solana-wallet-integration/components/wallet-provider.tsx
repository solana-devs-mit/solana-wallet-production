"use client"

import type React from "react"

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { TrustWalletAdapter } from "@solana/wallet-adapter-trust"
import { clusterApiUrl } from "@solana/web3.js"
import { useMemo } from "react"

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css"

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  // Configure the network (mainnet-beta, testnet, devnet)
  const network = "devnet" // Change to 'mainnet-beta' for production
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TrustWalletAdapter(), // Better mobile support and private key handling
    ],
    [],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export { SolanaProvider as SolanaWalletProvider }
