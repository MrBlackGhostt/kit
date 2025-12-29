"use client";
import { LazorkitProvider } from "@lazorkit/wallet";

import HomePage from "./components/home";
import { Code2Icon } from "lucide-react";
import CodeBlock from "./components/CodeBlock";
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
