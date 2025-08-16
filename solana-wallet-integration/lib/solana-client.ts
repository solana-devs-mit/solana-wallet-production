import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("devnet"), "confirmed")

export async function getWalletBalance(publicKey: string) {
  try {
    const pubKey = new PublicKey(publicKey)
    const balance = await connection.getBalance(pubKey)
    return balance / 1000000000 // Convert lamports to SOL
  } catch (error) {
    console.error("[v0] Error fetching balance:", error)
    throw error
  }
}

export async function getTransactionSignatures(publicKey: string) {
  try {
    const pubKey = new PublicKey(publicKey)
    console.log("[v0] Fetching signatures for:", publicKey)

    const signatures = await connection.getSignaturesForAddress(pubKey, {
      limit: 20,
    })

    console.log("[v0] Found signatures:", signatures.length)
    return signatures.map((sig) => sig.signature)
  } catch (error) {
    console.error("[v0] Error fetching signatures:", error)
    throw error
  }
}

export async function getFullTransactionHistory(publicKey: string) {
  try {
    const pubKey = new PublicKey(publicKey)
    console.log("[v0] Fetching full transaction history for:", publicKey)

    const signatures = await connection.getSignaturesForAddress(pubKey, {
      limit: 20,
    })

    console.log("[v0] Found signatures:", signatures.length)

    if (signatures.length === 0) {
      return []
    }

    const transactions = await Promise.all(
      signatures.map(async (sigInfo) => {
        try {
          const transaction = await connection.getTransaction(sigInfo.signature, {
            encoding: "json",
            maxSupportedTransactionVersion: 0,
          })

          if (!transaction) {
            console.log("[v0] Transaction not found:", sigInfo.signature)
            return null
          }

          return {
            signature: sigInfo.signature,
            slot: transaction.slot,
            blockTime: transaction.blockTime,
            fee: transaction.meta?.fee || 5000,
            status: transaction.meta?.err ? "Failed" : "Success",
            logMessages: transaction.meta?.logMessages?.slice(0, 3) || [],
            balanceChange:
              transaction.meta?.postBalances?.[0] && transaction.meta?.preBalances?.[0]
                ? (transaction.meta.postBalances[0] - transaction.meta.preBalances[0]) / 1000000000
                : 0,
          }
        } catch (error) {
          console.error("[v0] Error fetching transaction:", sigInfo.signature, error)
          return null
        }
      }),
    )

    return transactions.filter((tx) => tx !== null)
  } catch (error) {
    console.error("[v0] Error fetching transaction history:", error)
    throw error
  }
}
