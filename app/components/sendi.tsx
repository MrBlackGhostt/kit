import { useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Transaction,
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export const SendSolButton = () => {
  // 1. Get the connection (make sure your App is wrapped in ConnectionProvider with Devnet endpoint)
  const { connection } = useConnection();

  // 2. Get the user's public key and the sendTransaction function from the wallet adapter
  const { publicKey, sendTransaction } = useWallet();

  const handleSendSol = useCallback(async () => {
    if (!publicKey) {
      console.error("Wallet not connected!");
      return;
    }

    const RECIPIENT_ADDRESS = "Your_Receiver_Wallet_Address_Here"; // Replace this
    const SEND_AMOUNT_SOL = 0.1;

    try {
      console.log("Starting transaction...");

      // 3. Create the Transaction Instruction
      // "SystemProgram.transfer" is the specific instruction to move native SOL
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey, // The connected wallet
          toPubkey: new PublicKey(RECIPIENT_ADDRESS), // Who receives it
          lamports: SEND_AMOUNT_SOL * LAMPORTS_PER_SOL, // Convert SOL to Lamports (math required)
        }),
      );

      // 4. Get the latest blockhash (vital for transaction validity)
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      // 5. Ask the Wallet to Sign and Send
      // This line triggers the wallet popup (Phantom/Solflare) for the user
      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });

      console.log("Transaction sent! Signature:", signature);

      // 6. Wait for confirmation (Optional but recommended for UI feedback)
      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
      console.log("Transaction confirmed on Devnet!");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }, [publicKey, sendTransaction, connection]);

  return (
    <button onClick={handleSendSol} disabled={!publicKey}>
      Send 0.132342 SOL (Devnet)
    </button>
  );
};
