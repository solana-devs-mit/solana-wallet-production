"use client"

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"

export function WalletButton() {
  const { publicKey, connected } = useWallet()

  return (
    <div className="flex flex-col items-center gap-4">
      <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-lg" />

      {connected && publicKey && (
        <div className="text-sm text-muted-foreground bg-card p-3 rounded-lg border">
          <span className="font-medium">Connected:</span> {publicKey.toString().slice(0, 8)}...
          {publicKey.toString().slice(-8)}
        </div>
      )}
    </div>
  )
}
