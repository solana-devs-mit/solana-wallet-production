"use client"

import { useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Coins } from "lucide-react"

export function SolAirdrop() {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [amount, setAmount] = useState("0.5")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleAirdrop = async () => {
    if (!connected || !publicKey) {
      setMessage("Please connect your wallet first")
      return
    }

    const airdropAmount = Number.parseFloat(amount)
    if (isNaN(airdropAmount) || airdropAmount < 0.5 || airdropAmount > 5 || (airdropAmount * 2) % 1 !== 0) {
      setMessage("Please enter a valid amount in 0.5 increments between 0.5 and 5 SOL")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      console.log("[v0] Requesting airdrop:", airdropAmount, "SOL to", publicKey.toString())

      const lamports = airdropAmount * LAMPORTS_PER_SOL
      const signature = await connection.requestAirdrop(publicKey, lamports)

      console.log("[v0] Airdrop signature:", signature)

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed")

      if (confirmation.value.err) {
        throw new Error(`Airdrop failed: ${confirmation.value.err}`)
      }

      console.log("[v0] Airdrop confirmed:", confirmation)
      setMessage(`Successfully airdropped ${airdropAmount} SOL! 🎉`)
    } catch (error) {
      console.error("[v0] Airdrop error:", error)

      let userFriendlyMessage = ""

      if (error instanceof Error) {
        const errorStr = error.message.toLowerCase()

        if (errorStr.includes("429") || errorStr.includes("airdrop limit") || errorStr.includes("rate limit")) {
          userFriendlyMessage = "⏰ Airdrop limit reached. Please try again later (limits reset every few hours)"
        } else if (
          errorStr.includes("insufficient funds") ||
          errorStr.includes("faucet") ||
          errorStr.includes("run dry")
        ) {
          userFriendlyMessage = "💧 Devnet faucet is temporarily dry. Please try again in a few minutes"
        } else if (errorStr.includes("blockhash") || errorStr.includes("network")) {
          userFriendlyMessage = "🌐 Network issue detected. Please check your connection and try again"
        } else if (errorStr.includes("timeout")) {
          userFriendlyMessage = "⏱️ Request timed out. Please try again with a smaller amount"
        } else {
          userFriendlyMessage = "❌ Airdrop failed. Please try again or use a different amount"
        }
      } else {
        userFriendlyMessage = "❌ Unexpected error occurred. Please try again"
      }

      setMessage(userFriendlyMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!connected) {
    return (
      <Card className="relative border-0 shadow-xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl" />

        <CardContent className="relative pt-12 pb-12">
          <div className="text-center space-y-4">
            <Coins className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="text-lg font-medium text-muted-foreground">Connect your wallet to get started</div>
            <div className="text-sm text-muted-foreground">Get free test SOL for development on Solana devnet</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="relative border-0 shadow-xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl" />

      <CardHeader className="relative pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Coins className="h-5 w-5 text-primary" />
            <span className="font-semibold">Devnet SOL Airdrop</span>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Devnet
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <div className="text-center space-y-3">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Request Amount</div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Amount (SOL)
            </Label>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
              <Input
                id="amount"
                type="number"
                min="0.5"
                max="5"
                step="0.5"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.5 - 5.0"
                disabled={!connected || isLoading}
                className="border-0 bg-transparent text-center font-mono text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="text-xs text-muted-foreground">Increments of 0.5 SOL (0.5, 1.0, 1.5, 2.0, etc.)</div>
          </div>
        </div>

        <Button
          onClick={handleAirdrop}
          disabled={!connected || isLoading}
          className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Requesting Airdrop...
            </>
          ) : (
            <>
              <Coins className="mr-2 h-4 w-4" />
              Request Airdrop
            </>
          )}
        </Button>

        {message && (
          <div className="text-center">
            <div
              className={`text-sm p-3 rounded-lg border ${
                message.includes("Successfully")
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {message}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
