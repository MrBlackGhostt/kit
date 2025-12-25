"use client";
import Image from "next/image";
import { LazorkitProvider } from "@lazorkit/wallet";
import { ConnectButton } from "./components/ConnectButton";
import { TransferButton } from "./components/TransferButton";
import HomePage from "./components/home";
const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

const Home = () => {
  return (
    <LazorkitProvider
      isDebug={true}
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={{
        paymasterUrl: CONFIG.PAYMASTER.paymasterUrl,
      }}
    >
      <HomePage />
    </LazorkitProvider>
  );
};

export default Home;
