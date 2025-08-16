import { Connection, PublicKey } from "@solana/web3.js"
import { type NextRequest, NextResponse } from "next/server"

const getRpcUrl = () => {
  return process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com"
}

export async function GET(request: NextRequest, { params }: { params: { pubkey: string } }) {
  try {
    const { pubkey } = params

    // check public key
    let publicKey: PublicKey
    try {
      publicKey = new PublicKey(pubkey)
    } catch (error) {
      return NextResponse.json(
        {
          error: "Invalid public key",
        },
        {
          status: 400,
        },
      )
    }

    const rpcUrl = getRpcUrl()
    console.log(`[v0] Using RPC URL: ${rpcUrl}`)
    const connection = new Connection(rpcUrl, "confirmed")

    // GET transaction signatures
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 50 })
    console.log(`Found ${signatures.length} signatures`)

    return NextResponse.json(signatures)
  } catch (error) {
    console.error(`Transaction history fetch errro: `, error)
    return NextResponse.json(
      {
        error: `Failed to fetch transcaction history ${error}`,
      },
      { status: 500 },
    )
  }
}
