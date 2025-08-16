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

    // Connect to Solana devnet
    const rpcUrl = getRpcUrl()
    console.log(`[v0] Using RPC URL: ${rpcUrl}`)

    console.log(`[v0] Fetching full transaction history for ${pubkey}`)
    console.log(`[v0] Wallet address validation: ${publicKey.toString()}`)

    const commitmentLevels = ["confirmed", "finalized", "processed"] as const
    let signatures: any[] = []
    let connection: Connection

    for (const commitment of commitmentLevels) {
      try {
        console.log(`[v0] Trying commitment level: ${commitment}`)
        connection = new Connection(rpcUrl, commitment)
        signatures = await connection.getSignaturesForAddress(publicKey, { limit: 20 })
        console.log(`[v0] Found ${signatures.length} signatures with ${commitment} commitment`)
        if (signatures.length > 0) break
      } catch (error) {
        console.warn(`[v0] Failed with ${commitment} commitment:`, error)
      }
    }

    if (signatures.length === 0) {
      console.log(`[v0] No transactions found for ${pubkey} on devnet. Wallet may need devnet SOL or transactions.`)
      return NextResponse.json([])
    }

    const transactions = []
    for (const sigInfo of signatures) {
      try {
        const transaction = await connection!.getTransaction(sigInfo.signature, {
          encoding: "json",
          maxSupportedTransactionVersion: 0,
        })

        if (transaction) {
          console.log(`[v0] Transaction meta for ${sigInfo.signature}:`, {
            hasMeta: !!transaction.meta,
            fee: transaction.meta?.fee,
            hasAccountKeys: !!transaction.transaction?.message?.accountKeys,
            accountKeysLength: transaction.transaction?.message?.accountKeys?.length || 0,
          })

          const safeTransaction = {
            signature: sigInfo.signature,
            slot: transaction.slot,
            blockTime: transaction.blockTime,
            confirmationStatus: sigInfo.confirmationStatus,
            err: sigInfo.err,
            fee: transaction.meta?.fee || 5000, // Use actual fee or default to 5000 lamports
            success: !sigInfo.err,
            timestamp: transaction.blockTime ? new Date(transaction.blockTime * 1000).toISOString() : null,
            preBalances: transaction.meta?.preBalances || [],
            postBalances: transaction.meta?.postBalances || [],
            logMessages: transaction.meta?.logMessages?.slice(0, 3) || [],
            balanceChange:
              transaction.meta?.preBalances && transaction.meta?.postBalances
                ? (transaction.meta.postBalances[0] - transaction.meta.preBalances[0]) / 1000000000 // Convert lamports to SOL
                : 0,
            accountKeys: transaction.transaction?.message?.accountKeys?.slice(0, 5) || [],
          }

          transactions.push(safeTransaction)
          console.log(`[v0] Successfully processed transaction ${sigInfo.signature}`)
        }
      } catch (error) {
        console.warn(`[v0] Failed to fetch transaction ${sigInfo.signature}:`, error)
        transactions.push({
          signature: sigInfo.signature,
          slot: sigInfo.slot || 0,
          blockTime: sigInfo.blockTime,
          confirmationStatus: sigInfo.confirmationStatus,
          err: sigInfo.err,
          fee: 0,
          success: !sigInfo.err,
          timestamp: sigInfo.blockTime ? new Date(sigInfo.blockTime * 1000).toISOString() : null,
          preBalances: [],
          postBalances: [],
          logMessages: [],
          balanceChange: 0,
          accountKeys: [],
        })
        continue
      }
    }

    console.log(`[v0] Successfully fetched ${transactions.length} transactions for ${pubkey}`)
    return NextResponse.json(transactions)
  } catch (error) {
    console.error("[v0] Full transaction history fetch error:", error)
    return NextResponse.json({ error: `Failed to fetch full transaction history: ${error}` }, { status: 500 })
  }
}
