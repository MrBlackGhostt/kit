"use client";
import { useWallet } from "@lazorkit/wallet";
import { useBalance } from "../hooks/useBalance";
import { BalanceCard } from "../components/BalanceCard";
import { ConnectButton } from "./ConnectButton";
import PageTabs from "./PageTabs";
import { walletTabs } from "@/lib/tabConfig";
import { Fingerprint, Zap, Shield, Code2 } from "lucide-react";

const HomePage = () => {
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
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-white">Lazorkit Demo</h1>
                    {/* Social Links */}
                    <div className="flex items-center gap-1.5">
                      <a
                        href="https://github.com/MrBlackGhostt/kit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md hover:bg-slate-800/50 transition-colors"
                        title="View on GitHub"
                      >
                        <svg className="w-4 h-4 text-slate-400 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                      <a
                        href="https://x.com/HKsoldev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md hover:bg-slate-800/50 transition-colors"
                        title="Follow on X"
                      >
                        <svg className="w-4 h-4 text-slate-400 hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">Passkey-powered Solana Wallet</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Devnet Badge */}
                <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span>Devnet</span>
                </div>
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
              {/* Devnet Notice */}
              <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-300 mb-1">You're on Solana Devnet</p>
                    <p className="text-xs text-yellow-200/70 leading-relaxed mb-3">
                      This is a test network. SOL tokens here have no real value. Perfect for testing!
                    </p>
                    <a
                      href="https://faucet.solana.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-300 text-xs font-medium transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Get Test SOL from Faucet
                    </a>
                  </div>
                </div>
              </div>

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
            <PageTabs tabs={walletTabs} defaultTab="Setup" />
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
