import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@lazorkit/wallet";

const Send = () => {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();
  const to = new PublicKey("F5FjAAU6y22eUisRo1dzm5L6ENB4XTNMUGxJrYKsUBvY");

  const transfer = async () => {
    try {
      console.log("Starting transfer...");

      // ✅ Create instruction
      const transferIx = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey!,
        toPubkey: to,
        lamports: 0.34 * LAMPORTS_PER_SOL,
      });

      // ✅ Use your custom signAndSendTransaction (not signMessage!)
      const signature = await signAndSendTransaction({
        instructions: [transferIx],
        transactionOptions: {
          feeToken: "SOL", // Use SOL instead of USDC if not set up
          computeUnitLimit: 200_000, // Lower compute units
        },
      });

      console.log(`✅ Transaction successful: ${signature}`);
      console.log(
        `View: https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      );
    } catch (error) {
      console.error("❌ Transfer failed:", error);
    }
  };

  return (
    <div>
      <button onClick={() => transfer()}>Send 0.34 SOL</button>
    </div>
  );
};

export default Send;
