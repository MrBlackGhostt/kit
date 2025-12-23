// TransferButton.tsx
import { useWallet } from "@lazorkit/wallet";
// import { useWallet } from "@solana/wallet-adapter-react";
import {
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";
import { log } from "console";
export function TransferButton() {
  const {
    signAndSendTransaction,
    smartWalletPubkey,
    isConnected,
    isLoading,
    connect,
    wallet,
    disconnect,
  } = useWallet();

  const Connection_new = new Connection(clusterApiUrl("devnet"), "confirmed");

  if (isConnected && smartWalletPubkey) {
    console.log(
      "✅ Connected! Smart Wallet PDA:",
      smartWalletPubkey.toString(),
    );
  }

  const handleTransfer = async () => {
    try {
      console.log(`Requesting airdrop for ${smartWalletPubkey}`);
      const signatureA = await Connection_new.requestAirdrop(
        new PublicKey(smartWalletPubkey ? smartWalletPubkey : "sddsdfsdasaas"),
        1 * LAMPORTS_PER_SOL,
      ); // Confirm the transaction
      const latestBlockHash = await Connection_new.getLatestBlockhash();
      await Connection_new.confirmTransaction({
        signature: signatureA,
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      });
      if (!smartWalletPubkey || !isConnected) {
        console.log("❌ No wallet connected");
        return;
      }
      console.log("🚀 Before transfer - PDA:", smartWalletPubkey.toString());
      // 1. Create Instruction

      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: new PublicKey("7BeWr6tVa1pYgrEddekYTnQENU22bBw9H8HYJUkbrN71"),
        lamports: 0.1 * LAMPORTS_PER_SOL,
      });

      // 2. Sign and Send
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        // transactionOptions: {
        //   feeToken: "USDC", // Optional: Pay gas in USDC
        // },
      });

      console.log("Transaction confirmed:", signature);
    } catch (error) {
      console.error("Transfer failed:", error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lazorkit Gasless Demo</h1>

      {!isConnected ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Click to create passkey (no account needed)
          </p>
          <button
            onClick={() => connect()}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Connect Passkey Wallet"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-medium text-green-800">✅ Connected</p>
            <p className="text-sm text-green-700 break-all">
              PDA: {smartWalletPubkey!.toString().slice(0, 8)}...
              {smartWalletPubkey!.toString().slice(-8)}
            </p>
          </div>
          <button
            onClick={handleTransfer}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Gasless 0.001 SOL"}
          </button>
          <button
            onClick={() => disconnect()}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
