"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTransactionSignatures, getFullTransactionHistory } from "@/lib/solana-client"
import { History, Clock, ExternalLink } from "lucide-react"

export function TransactionHistory() {
  const { publicKey, connected } = useWallet()
  const [signatures, setSignatures] = useState<any[]>([])
  const [fullHistory, setFullHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSignatures = async () => {
    if (!connected || !publicKey) return

    setLoading(true)
    setError(null)

    try {
      console.log(`[v0] Frontend: Fetching signatures for wallet: ${publicKey.toString()}`)
      const data = await getTransactionSignatures(publicKey.toString())
      console.log(`[v0] Frontend: Received ${data.length} signatures`)
      setSignatures(data.map((sig) => ({ signature: sig })))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch signatures")
    } finally {
      setLoading(false)
    }
  }

  const fetchFullHistory = async () => {
    if (!connected || !publicKey) return

    setLoading(true)
    setError(null)

    try {
      console.log(`[v0] Frontend: Fetching full history for wallet: ${publicKey.toString()}`)
      const data = await getFullTransactionHistory(publicKey.toString())
      console.log(`[v0] Frontend: Received ${data.length} full transactions`)
      setFullHistory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch full history")
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
            <History className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="text-lg font-medium text-muted-foreground">Connect your wallet to view history</div>
            <div className="text-sm text-muted-foreground">Track your transaction signatures and details</div>
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

      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3">
          <History className="h-5 w-5 text-primary" />
          <span className="font-semibold">Transaction History</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <Tabs defaultValue="signatures" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="signatures" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Signatures Only
            </TabsTrigger>
            <TabsTrigger value="full" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Full History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signatures" className="space-y-4">
            <Button onClick={fetchSignatures} disabled={loading} className="w-full">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Loading Signatures...
                </div>
              ) : (
                "Fetch Signatures"
              )}
            </Button>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</div>
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {signatures.length === 0 && !loading && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="text-yellow-800 dark:text-yellow-200 text-sm">
                    <p className="font-medium mb-2">No transactions found</p>
                    <p>This wallet has no transactions on devnet. To test:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>
                        Get devnet SOL from{" "}
                        <a
                          href="https://faucet.solana.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Solana Faucet
                        </a>
                      </li>
                      <li>Make a test transaction using the Send SOL form above</li>
                      <li>Ensure Phantom is set to Devnet network</li>
                    </ul>
                  </div>
                </div>
              )}
              {signatures.map((sig, index) => (
                <div key={index} className="p-4 bg-muted/30 border border-border/50 rounded-lg backdrop-blur-sm">
                  <div className="font-mono text-sm break-all mb-3 text-foreground">{sig.signature}</div>
                  <div className="flex gap-2">
                    <Badge variant={sig.err ? "destructive" : "default"} className="font-medium">
                      {sig.err ? "Failed" : "Success"}
                    </Badge>
                    {sig.slot && <Badge variant="outline">Slot: {sig.slot}</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="full" className="space-y-4">
            <Button onClick={fetchFullHistory} disabled={loading} className="w-full">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Loading Full History...
                </div>
              ) : (
                "Fetch Full History"
              )}
            </Button>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</div>
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {fullHistory.length === 0 && !loading && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="text-yellow-800 dark:text-yellow-200 text-sm">
                    <p className="font-medium mb-2">No transaction history found</p>
                    <p>This wallet has no transactions on devnet. To test:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>
                        Get devnet SOL from{" "}
                        <a
                          href="https://faucet.solana.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Solana Faucet
                        </a>
                      </li>
                      <li>Make a test transaction using the Send SOL form above</li>
                      <li>Ensure Phantom is set to Devnet network</li>
                    </ul>
                  </div>
                </div>
              )}
              {fullHistory.map((tx, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/30 border border-border/50 rounded-lg backdrop-blur-sm space-y-3"
                >
                  <div className="font-mono text-xs break-all text-foreground bg-muted/50 p-2 rounded border">
                    {tx.signature || "No signature"}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">Slot:</span>
                      <span className="text-foreground">{tx.slot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">Time:</span>
                      <span className="text-foreground">
                        {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">Fee:</span>
                      <span className="text-foreground">{tx.fee || 0} lamports</span>
                    </div>
                  </div>
                  {tx.signature && (
                    <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                      <a
                        href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View on Explorer
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
