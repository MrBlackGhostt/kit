"use client";
import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";
import { useBalance } from "../hooks/useBalance";
import { BalanceCard } from "../components/BalanceCard";
import { ConnectButton } from "./ConnectButton";
import PageTabs from "./PageTabs";
import { walletTabs } from "@/lib/tabConfig";
import { Fingerprint, Zap, Shield, Code2 } from "lucide-react";

const HomePage = () => {
  const [net, setnet] = useState("devnet");
  const { smartWalletPubkey, isConnected } = useWallet();
  const { sol, lamports, isLoading } = useBalance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-slate-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Fingerprint className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Lazorkit Demo</h1>
                  <p className="text-xs text-slate-400">Passkey-powered Solana Wallet</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={net}
                  onChange={(e) => setnet(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  <option value="devnet">Devnet</option>
                  <option value="mainnet-beta">Mainnet</option>
                </select>
                <ConnectButton />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Section */}
          {!isConnected && (
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-6">
                <Zap className="w-4 h-4" />
                <span>No wallet extension required</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Solana Wallet
                <br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Without the Hassle
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                Experience Solana with passkey authentication. No seed phrases, no browser extensions, just your fingerprint or face ID.
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <FeaturePill icon={Fingerprint} text="Passkey Auth" />
                <FeaturePill icon={Zap} text="Gasless Transactions" />
                <FeaturePill icon={Shield} text="Smart Wallet" />
                <FeaturePill icon={Code2} text="Easy Integration" />
              </div>
            </div>
          )}

          {/* Wallet Dashboard - shown when connected */}
          {isConnected && (
            <div className="mb-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Your Smart Wallet</h3>
                <p className="text-slate-400">Powered by Lazorkit passkey authentication</p>
              </div>
              <BalanceCard
                sol={sol}
                lamports={lamports}
                isLoading={isLoading}
                address={smartWalletPubkey?.toBase58()}
              />
            </div>
          )}

          {/* Features Grid */}
          {!isConnected && (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <FeatureCard
                icon={Fingerprint}
                title="Passkey Authentication"
                description="Log in with your fingerprint or Face ID. No more seed phrases to remember or lose."
                gradient="from-indigo-500 to-purple-600"
              />
              <FeatureCard
                icon={Zap}
                title="Gasless Transactions"
                description="Send SOL and tokens without worrying about gas fees. Smart wallet handles it all."
                gradient="from-purple-500 to-pink-600"
              />
              <FeatureCard
                icon={Shield}
                title="Smart Wallet Security"
                description="Built on Solana's native passkey support. Your keys, secured by your device."
                gradient="from-pink-500 to-rose-600"
              />
            </div>
          )}

          {/* Code Examples Section */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Integration Examples</h3>
                <p className="text-sm text-slate-400">See how easy it is to integrate Lazorkit</p>
              </div>
            </div>
            <PageTabs tabs={walletTabs} defaultTab="Page.tsx" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature Pill Component
const FeaturePill = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 text-sm">
    <Icon className="w-4 h-4 text-indigo-400" />
    <span>{text}</span>
  </div>
);

// Feature Card Component
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon: any;
  title: string;
  description: string;
  gradient: string;
}) => (
  <div className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300">
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

export default HomePage;
