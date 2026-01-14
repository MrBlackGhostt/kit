import dedent from "dedent";

export const CodeSnippet = {
  setup: dedent`
  // 1. Install Lazorkit SDK
  npm install @lazorkit/wallet @solana/web3.js

  // 2. Wrap your app with LazorkitProvider
  import { LazorkitProvider } from "@lazorkit/wallet";

  export default function App() {
    return (
      <LazorkitProvider
        rpcUrl="https://api.devnet.solana.com"
        portalUrl="https://portal.lazor.sh"
        paymasterConfig={{
          paymasterUrl: "https://kora.devnet.lazorkit.com"
        }}
      >
        <YourApp />
      </LazorkitProvider>
    );
  }`,

  connect: dedent`
  // Passkey authentication - no seed phrases needed!
  import { useWallet } from "@lazorkit/wallet";

  export function ConnectButton() {
    const { connect, disconnect, isConnected } = useWallet();

    if (isConnected) {
      return <button onClick={disconnect}>Disconnect</button>;
    }

    return (
      <button onClick={connect}>
        Connect with Passkey
      </button>
    );
  }

  // That's it! Users authenticate with fingerprint/Face ID`,

  send: dedent`
  // Gasless SOL transfer - no transaction fees!
  import { useWallet } from "@lazorkit/wallet";
  import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

  export function SendSOL() {
    const { signAndSendTransaction, smartWalletPubkey } = useWallet();

    const sendTransaction = async (recipient, amount) => {
      // Create transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipient,
        lamports: amount * LAMPORTS_PER_SOL,
      });

      // Send gasless transaction
      const signature = await signAndSendTransaction({
        instructions: [instruction],
      });

      return signature;
    };
  }

  // Paymaster handles all gas fees automatically!`,

  balance: dedent`
  // Fetch wallet balance in real-time
  import { useWallet } from "@lazorkit/wallet";
  import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
  import { useEffect, useState } from "react";

  export function useBalance() {
    const { smartWalletPubkey } = useWallet();
    const [balance, setBalance] = useState(0);

    useEffect(() => {
      if (!smartWalletPubkey) return;

      const connection = new Connection(
        clusterApiUrl("devnet"),
        "confirmed"
      );

      const fetchBalance = async () => {
        const bal = await connection.getBalance(smartWalletPubkey);
        setBalance(bal / LAMPORTS_PER_SOL);
      };

      fetchBalance();
      // Poll every 10 seconds
      const interval = setInterval(fetchBalance, 10000);
      return () => clearInterval(interval);
    }, [smartWalletPubkey]);

    return balance;
  }`,
};
