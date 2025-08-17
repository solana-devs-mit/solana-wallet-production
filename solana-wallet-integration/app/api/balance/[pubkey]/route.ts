import { type NextRequest, NextResponse } from "next/server"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

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

    // Connect to Solana
    const connection = new Connection(getRpcUrl(), "confirmed")

    // Get balance
    const balanceLamports = await connection.getBalance(publicKey)
    const balanceSol = balanceLamports / LAMPORTS_PER_SOL

    return NextResponse.json({
      pubkey,
      balance_sol: balanceSol,
    })
  } catch (error) {
    console.error("Balance fetch error:", error)
    return NextResponse.json({ error: `Failed to fetch balance: ${error}` }, { status: 500 })
  }
}
