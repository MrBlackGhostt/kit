# Tutorial: Building Gasless Transactions with Lazorkit

## Introduction

One of the biggest UX barriers in blockchain is gas fees. Users need to:
1. Acquire native tokens before doing anything
2. Understand gas mechanics
3. Maintain sufficient balance for fees

With Lazorkit's smart wallet and paymaster integration, you can offer **completely gasless transactions** to your users. They can send SOL and tokens without ever thinking about fees.

## How Gasless Transactions Work

Traditional Solana transaction:
```
User signs transaction → User pays fee → Transaction executes
```

Lazorkit gasless transaction:
```
User signs transaction → Paymaster pays fee → Transaction executes
```

The **paymaster** is a service that sponsors transaction fees on behalf of users. This can be:
- Your own paymaster (you cover costs)
- Lazorkit's paymaster (during development)
- A third-party sponsor

## Prerequisites

- Completed Tutorial 1 (Passkey Authentication)
- User wallet connected via passkey
- Some SOL in the wallet for testing (get from [Solana Faucet](https://faucet.solana.com))

## Step 1: Understanding the Smart Wallet

When users connect with Lazorkit, they get a **smart wallet** - a special type of Solana account that:

- Is controlled by passkey authentication
- Supports gasless transactions via paymasters
- Can be recovered across devices
- Provides enhanced security features

Access it via the `useWallet` hook:

```typescript
import { useWallet } from "@lazorkit/wallet";

const { smartWalletPubkey, signAndSendTransaction } = useWallet();
```

## Step 2: Create a Simple Transfer Component

Create `components/SendSOL.tsx`:

```typescript
"use client";
import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

export function SendSOL() {
  const { smartWalletPubkey, signAndSendTransaction } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!smartWalletPubkey) {
      alert("Wallet not connected");
      return;
    }

    try {
      setSending(true);

      // Create the transfer instruction
      const recipientPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const transferIx = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports,
      });

      // Send the transaction (gasless!)
      const signature = await signAndSendTransaction({
        instructions: [transferIx],
        transactionOptions: {
          feeToken: "SOL",
          computeUnitLimit: 500_000,
        },
      });

      console.log("Transaction successful:", signature);
      alert(`Sent ${amount} SOL! Signature: ${signature}`);

      // Reset form
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed: " + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h3>Send SOL (Gasless)</h3>
      
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        step="0.01"
      />

      <button 
        onClick={handleSend}
        disabled={sending || !recipient || !amount}
      >
        {sending ? "Sending..." : "Send SOL"}
      </button>

      <p style={{ fontSize: "12px", color: "#888" }}>
        No gas fees required!
      </p>
    </div>
  );
}
```

## Step 3: Understanding signAndSendTransaction

The `signAndSendTransaction` function is the core of gasless transactions:

```typescript
const signature = await signAndSendTransaction({
  instructions: [instruction1, instruction2],  // Array of transaction instructions
  transactionOptions: {
    feeToken: "SOL",           // Which token to use for fees
    computeUnitLimit: 500_000, // Max compute units (gas)
  },
});
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `instructions` | `TransactionInstruction[]` | Solana instructions to execute |
| `transactionOptions.feeToken` | `string` | Token to pay fees with (e.g., "SOL", "USDC") |
| `transactionOptions.computeUnitLimit` | `number` | Maximum compute units to use |

### What Happens Behind the Scenes

1. **Transaction is built** with your instructions
2. **Paymaster adds fee payment instruction** to cover costs
3. **User signs with passkey** (biometric authentication)
4. **Transaction is submitted** to Solana
5. **Signature is returned** on success

## Step 4: Add Input Validation

Improve the component with proper validation:

```typescript
import { useMemo } from "react";

export function SendSOL() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  // Validate recipient address
  const recipientValid = useMemo(() => {
    try {
      if (!recipient.trim()) return false;
      new PublicKey(recipient.trim());
      return true;
    } catch {
      return false;
    }
  }, [recipient]);

  // Validate amount
  const amountValid = useMemo(() => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  }, [amount]);

  const canSend = recipientValid && amountValid && !sending;

  return (
    <div>
      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Solana address"
      />
      {recipient && !recipientValid && (
        <p style={{ color: "red" }}>Invalid address</p>
      )}

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
      />
      {amount && !amountValid && (
        <p style={{ color: "red" }}>Invalid amount</p>
      )}

      <button onClick={handleSend} disabled={!canSend}>
        Send {amount || "0"} SOL
      </button>
    </div>
  );
}
```

## Step 5: Handle Transaction Errors

Implement robust error handling:

```typescript
const handleSend = async () => {
  try {
    setSending(true);
    
    const recipientPubkey = new PublicKey(recipient);
    const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

    const transferIx = SystemProgram.transfer({
      fromPubkey: smartWalletPubkey,
      toPubkey: recipientPubkey,
      lamports,
    });

    const signature = await signAndSendTransaction({
      instructions: [transferIx],
      transactionOptions: {
        feeToken: "SOL",
        computeUnitLimit: 500_000,
      },
    });

    console.log("✅ Transaction successful:", signature);
    
    // Show success message
    toast.success(`Sent ${amount} SOL successfully!`);
    
    // View on explorer
    const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
    console.log("View on explorer:", explorerUrl);

  } catch (error: any) {
    console.error("❌ Transaction failed:", error);

    // User-friendly error messages
    if (error.message?.includes("Insufficient funds")) {
      alert("Insufficient balance");
    } else if (error.message?.includes("User rejected")) {
      alert("Transaction cancelled");
    } else {
      alert("Transaction failed: " + error.message);
    }
  } finally {
    setSending(false);
  }
};
```

## Step 6: Add Retry Logic

Blockchain transactions can fail due to network issues. Add automatic retries:

```typescript
const sendWithRetry = async (maxRetries = 3) => {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const recipientPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const transferIx = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports,
      });

      const signature = await signAndSendTransaction({
        instructions: [transferIx],
        transactionOptions: {
          feeToken: "SOL",
          computeUnitLimit: 500_000,
        },
      });

      console.log(`✅ Success on attempt ${attempt + 1}`);
      return signature; // Success!

    } catch (error: any) {
      attempt++;

      // Check if error is retryable
      const isRetryable = 
        error.message?.includes("blockhash") ||
        error.message?.includes("timeout") ||
        error.message?.includes("429");

      if (isRetryable && attempt < maxRetries) {
        console.log(`🔄 Retry ${attempt}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
        continue;
      }

      throw error; // Non-retryable or max retries reached
    }
  }
};
```

## Step 7: Track Transaction Status

Show users real-time transaction status:

```typescript
const [status, setStatus] = useState<"idle" | "signing" | "sending" | "confirming" | "success" | "error">("idle");

const handleSend = async () => {
  try {
    setStatus("signing");
    // User approves with passkey...

    setStatus("sending");
    const signature = await signAndSendTransaction({...});

    setStatus("confirming");
    // Wait for confirmation
    await connection.confirmTransaction(signature, "confirmed");

    setStatus("success");
    setTimeout(() => setStatus("idle"), 3000);

  } catch (error) {
    setStatus("error");
    setTimeout(() => setStatus("idle"), 3000);
  }
};

// In JSX
<button disabled={status !== "idle"}>
  {status === "signing" && "🔐 Approve with passkey..."}
  {status === "sending" && "📤 Sending transaction..."}
  {status === "confirming" && "⏳ Confirming..."}
  {status === "success" && "✅ Sent!"}
  {status === "error" && "❌ Failed"}
  {status === "idle" && "Send SOL"}
</button>
```

## Advanced: Send SPL Tokens (Gasless)

You can also send tokens gaslessly:

```typescript
import { getAssociatedTokenAddress, createTransferInstruction } from "@solana/spl-token";

async function sendToken(
  tokenMint: PublicKey,
  recipient: PublicKey,
  amount: number
) {
  // Get token accounts
  const fromTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    smartWalletPubkey
  );

  const toTokenAccount = await getAssociatedTokenAddress(
    tokenMint,
    recipient
  );

  // Create transfer instruction
  const transferIx = createTransferInstruction(
    fromTokenAccount,
    toTokenAccount,
    smartWalletPubkey,
    amount
  );

  // Send gasless transaction
  const signature = await signAndSendTransaction({
    instructions: [transferIx],
    transactionOptions: {
      feeToken: "SOL",
      computeUnitLimit: 500_000,
    },
  });

  return signature;
}
```

## Best Practices

### 1. Always validate inputs

```typescript
if (!recipientValid || !amountValid) {
  throw new Error("Invalid input");
}
```

### 2. Set appropriate compute limits

```typescript
// Simple transfer: 500k
computeUnitLimit: 500_000

// Complex DeFi interaction: 1.4M
computeUnitLimit: 1_400_000
```

### 3. Provide transaction receipts

```typescript
const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
console.log("View transaction:", explorerUrl);
```

### 4. Handle edge cases

- Insufficient balance
- User cancellation
- Network timeouts
- Invalid addresses

## Testing Your Implementation

1. **Get test SOL**
   - Visit [Solana Faucet](https://faucet.solana.com)
   - Enter your wallet address
   - Request 1-2 SOL

2. **Test a transfer**
   - Enter a recipient address
   - Enter amount (e.g., 0.01 SOL)
   - Click send
   - Approve with passkey
   - ✅ Transaction completes without paying fees!

3. **Verify on Explorer**
   - Copy transaction signature
   - Open Solana Explorer
   - Search for your transaction
   - Confirm it shows "Paid by: <Paymaster Address>"

## Troubleshooting

### "Insufficient funds for rent"

Even gasless transactions require the recipient to have rent-exempt balance.

**Solution**: Ensure recipient account has ~0.001 SOL for rent exemption.

### "Transaction too large"

Too many instructions in one transaction.

**Solution**: 
- Split into multiple transactions
- Or reduce compute limit

### "Blockhash not found"

Transaction expired before confirmation.

**Solution**: Implement retry logic (see Step 6)

## Next Steps

You now have gasless transactions working! Consider:

1. ✅ Adding token transfers
2. ✅ Building DeFi integrations
3. ✅ Creating NFT minting flows
4. ✅ Implementing batch transactions

## Resources

- [Solana Transaction Guide](https://docs.solana.com/developing/programming-model/transactions)
- [Lazorkit Paymaster Docs](https://docs.lazorkit.com)
- [Transaction Explorer](https://explorer.solana.com)

---

**Congratulations!** Your users can now send SOL without ever worrying about gas fees. This dramatically improves UX and removes a major onboarding barrier.
