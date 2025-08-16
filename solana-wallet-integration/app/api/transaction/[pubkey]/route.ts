import { type NextRequest, NextResponse } from "next/server"
import { Connection, PublicKey } from "@solana/web3.js"

export const dynamic = "force-dynamic"

const getRpcUrl = () => {
  return process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com"
}

export async function GET(request: NextRequest, { params }: { params: { pubkey: string } }) {
  try {
    const { pubkey } = params

    // Validate public key
    let publicKey: PublicKey
    try {
      publicKey = new PublicKey(pubkey)
    } catch (error) {
      return NextResponse.json({ error: "Invalid public key" }, { status: 400 })
    }

    const rpcUrl = getRpcUrl()
    console.log(`[v0] Using RPC URL: ${rpcUrl}`)
    const connection = new Connection(rpcUrl, "confirmed")

    console.log(`[v0] Fetching signatures for ${pubkey}`)
    console.log(`[v0] Wallet address validation: ${publicKey.toString()}`)

    // Try different commitment levels to find transactions
    const commitmentLevels = ["confirmed", "finalized", "processed"] as const
    let signatures: any[] = []

    for (const commitment of commitmentLevels) {
      try {
        console.log(`[v0] Trying commitment level: ${commitment}`)
        const conn = new Connection(rpcUrl, commitment)
        signatures = await conn.getSignaturesForAddress(publicKey, { limit: 100 })
        console.log(`[v0] Found ${signatures.length} signatures with ${commitment} commitment`)
        if (signatures.length > 0) break
      } catch (error) {
        console.warn(`[v0] Failed with ${commitment} commitment:`, error)
      }
    }

    if (signatures.length === 0) {
      console.log(`[v0] No transactions found for ${pubkey} on devnet. Wallet may need devnet SOL or transactions.`)
    }

    return NextResponse.json(signatures)
  } catch (error) {
    console.error("[v0] Transaction history fetch error:", error)
    return NextResponse.json({ error: `Failed to fetch transaction history: ${error}` }, { status: 500 })
  }
}
