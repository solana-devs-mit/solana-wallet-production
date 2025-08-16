import { WalletButton } from "@/components/wallet-button"
import { WalletInfo } from "@/components/wallet-info"
import { TransactionHistory } from "@/components/transaction-history"
import { SendSolForm } from "@/components/send-sol-form"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/15 to-secondary/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl" />

      <div className="relative border-b border-border/30">
        <div className="relative container mx-auto px-6 py-20 max-w-6xl">
          <div className="text-center space-y-8">
            {/* Main title with enhanced styling */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h1 className="text-7xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  Solana Wallet
                </h1>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary">Devnet Active</span>
              </div>
            </div>

            {/* Enhanced description */}
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Secure, fast, and intuitive wallet management on the Solana devnet
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground/80 max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>Phantom Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                <span>Transaction History</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>Instant Transfers</span>
              </div>
            </div>

            {/* Wallet connection with enhanced styling */}
            <div className="flex justify-center pt-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25" />
                <div className="relative">
                  <WalletButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="relative container mx-auto px-6 py-16 max-w-6xl">
        <div className="relative grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <WalletInfo />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <SendSolForm />
            <TransactionHistory />
          </div>
        </div>
      </main>
    </div>
  )
}
