"use client";
import { PublicKey, useWallet } from "@lazorkit/wallet";
import { useState, useMemo } from "react";
import { useBalance } from "../hooks/useBalance";
import { BalanceCard } from "../components/BalanceCard";
import { ConnectButton } from "./ConnectButton";
import PageTabs from "./PageTabs";
import { walletTabs } from "@/lib/tabConfig"; // Move your tab array here

import { Connection, clusterApiUrl } from "@solana/web3.js";

const HomePage = () => {
  const [net, setnet] = useState("devnet");
  const { smartWalletPubkey } = useWallet();
  const { sol, lamports, isLoading } = useBalance();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100 p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-start justify-between">
          <Header net={net} onNetChange={setnet} />
          <ConnectButton />
        </div>
        <BalanceCard
          sol={sol}
          lamports={lamports}
          isLoading={isLoading}
          address={smartWalletPubkey?.toBase58()}
        />
        <div className="mt-6">
          <PageTabs tabs={walletTabs} defaultTab="Page.tsx" />
        </div>
      </div>
    </div>
  );
};

const Header = ({ net, onNetChange }: any) => (
  <div>
    <h1 className="text-xl font-semibold">Wallet Dashboard</h1>
    <select
      value={net}
      onChange={(e) => onNetChange(e.target.value)}
      className="bg-transparent text-xs text-slate-400"
    >
      <option value="devnet">Devnet</option>
      <option value="mainnet-beta">MainNet</option>
    </select>
  </div>
);

export default HomePage;
