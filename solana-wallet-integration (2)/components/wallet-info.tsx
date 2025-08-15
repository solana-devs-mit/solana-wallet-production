"use client"

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wallet, Copy } from "lucide-react"

export function WalletInfo() {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchBalance = async () => {
    if (connected && publicKey) {
      setLoading(true)
      try {
        const balance = await connection.getBalance(publicKey)
        setBalance(balance / LAMPORTS_PER_SOL)
      } catch (error) {
        console.error("Failed to fetch balance:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRefresh = () => {
    fetchBalance()
  }

  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [connection, publicKey, connected])

  if (!connected) {
    return (
      <Card className="relative border-0 shadow-xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl" />

        <CardContent className="relative pt-12 pb-12">
          <div className="text-center space-y-4">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="text-lg font-medium text-muted-foreground">Connect your wallet to get started</div>
            <div className="text-sm text-muted-foreground">View your balance and manage transactions</div>
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
            <Wallet className="h-5 w-5 text-primary" />
            <span className="font-semibold">Wallet Overview</span>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <div className="text-center space-y-3">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Balance</div>
          <div className="flex items-center justify-center gap-3">
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {loading ? (
                <span className="text-muted-foreground">Loading...</span>
              ) : balance !== null ? (
                `${balance.toFixed(4)} SOL`
              ) : (
                <span className="text-muted-foreground">Unable to load</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">Devnet Balance</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Wallet Address</label>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
            <div className="font-mono text-sm flex-1 break-all text-foreground">{publicKey?.toString()}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="h-8 w-8 p-0 hover:bg-primary/10 flex-shrink-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          {copied && <div className="text-xs text-primary font-medium">Address copied to clipboard!</div>}
        </div>
      </CardContent>
    </Card>
  )
}
