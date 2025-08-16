"use client"

import type React from "react"
import { useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, ExternalLink, Shield, AlertTriangle, CheckCircle } from "lucide-react"

export function SendSolForm() {
  const { publicKey, connected, sendTransaction, wallet } = useWallet()
  const { connection } = useConnection()
  const [receiverAddress, setReceiverAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSendSol = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey || !sendTransaction) return

    setLoading(true)
    setError(null)
    setSignature(null)

    try {
      if (wallet?.adapter && "switchNetwork" in wallet.adapter) {
        try {
          await (wallet.adapter as any).switchNetwork("devnet")
        } catch (switchError) {
          console.log("Network switch not supported or failed:", switchError)
        }
      }

      const receiverPubkey = new PublicKey(receiverAddress)
      const amountLamports = Number.parseFloat(amount) * LAMPORTS_PER_SOL

      const networkInfo = await connection.getVersion()
      console.log("[v0] Connected to network:", networkInfo)

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: receiverPubkey,
          lamports: amountLamports,
        }),
      )

      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      const txSignature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(txSignature, "confirmed")
      setSignature(txSignature)
    } catch (err) {
      console.error("Transaction error:", err)
      setError(err instanceof Error ? err.message : "Transaction failed")
    } finally {
      setLoading(false)
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
            <Send className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="text-lg font-medium text-muted-foreground">Connect your wallet to send SOL</div>
            <div className="text-sm text-muted-foreground">Secure transactions powered by Phantom</div>
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
        <CardTitle className="flex items-center gap-3">
          <Send className="h-5 w-5 text-primary" />
          <span className="font-semibold">Send Test SOL</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <div className="space-y-3">
              <div className="font-medium">Network Configuration Required</div>
              <div className="text-sm">
                Ensure your Phantom wallet is set to <strong>Devnet</strong>:
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center text-xs font-bold text-amber-800 dark:text-amber-200">
                      1
                    </span>
                    <span>Open Phantom wallet settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center text-xs font-bold text-amber-800 dark:text-amber-200">
                      2
                    </span>
                    <span>Navigate to Developer Settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center text-xs font-bold text-amber-800 dark:text-amber-200">
                      3
                    </span>
                    <span>Select "Change Network"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center text-xs font-bold text-amber-800 dark:text-amber-200">
                      4
                    </span>
                    <span>
                      Choose <strong>"Devnet"</strong>
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSendSol} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receiver" className="text-sm font-medium">
              Receiver Address
            </Label>
            <Input
              id="receiver"
              type="text"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              placeholder="Enter recipient's public key"
              className="font-mono text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount (SOL)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.1"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 text-base font-medium">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing Transaction...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send SOL
              </div>
            )}
          </Button>
        </form>

        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <div className="font-medium">Secure Wallet Signing</div>
            <div className="text-sm mt-1">
              Your Phantom wallet signs transactions locally. Private keys never leave your device.
            </div>
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive" className="border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {signature && (
          /* Enhanced transaction success display with better styling */
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-800 dark:text-green-200 text-lg">
                    Transaction Successful!
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-green-700 dark:text-green-300">Transaction Signature:</div>
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                    <div className="font-mono text-xs break-all text-green-800 dark:text-green-200">{signature}</div>
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/30 bg-transparent font-medium"
                  >
                    <a
                      href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Solana Explorer
                    </a>
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
