// No longer need external API URL since we're using internal API routes
export interface TransactionParams {
  payer_id: string
  reciever_id: string
  amount_in_sol: number
}

export interface TransactionResponse {
  signature: string
  sender_balance_sol: number
  receiver_balance_sol: number
}

export interface BalanceResponse {
  pubkey: string
  balance_sol: number
}

// Get balance from Next.js API route
export async function getBalance(pubkey: string): Promise<BalanceResponse> {
  const response = await fetch(`/api/balance/${pubkey}`)
  if (!response.ok) {
    throw new Error("Failed to fetch balance")
  }
  return response.json()
}

// Send SOL transaction (not used anymore - using wallet signing)
export async function sendTransaction(params: TransactionParams): Promise<TransactionResponse> {
  const response = await fetch(`/api/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })
  if (!response.ok) {
    throw new Error("Failed to send transaction")
  }
  return response.json()
}

// Get transaction signatures only
export async function getTransactionHistory(pubkey: string): Promise<any[]> {
  const response = await fetch(`/api/transaction/${pubkey}`)
  if (!response.ok) {
    throw new Error("Failed to fetch transaction history")
  }
  return response.json()
}

// Get full transaction history
export async function getFullTransactionHistory(pubkey: string): Promise<any[]> {
  const response = await fetch(`/api/transaction/full/${pubkey}`)
  if (!response.ok) {
    throw new Error("Failed to fetch full transaction history")
  }
  return response.json()
}
