import { useWallet } from "@lazorkit/wallet";
import { Fingerprint, LogOut } from "lucide-react";

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } =
    useWallet();

  if (isConnected && wallet) {
    return (
      <button
        onClick={() => disconnect()}
        className="group inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200
                   border border-slate-700/50 bg-slate-800/50 text-slate-100 
                   hover:bg-slate-700/50 hover:border-slate-600
                   focus:outline-none focus:ring-2 focus:ring-indigo-400/40 
                   active:scale-[0.98]"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Connected</span>
        </div>
        <LogOut className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  return (
    <button
      onClick={() => connect()}
      disabled={isConnecting}
      className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200
                 bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                 hover:from-indigo-400 hover:to-purple-500
                 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 
                 active:scale-[0.98]
                 disabled:cursor-not-allowed disabled:opacity-60 disabled:from-slate-700 disabled:to-slate-700
                 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
    >
      <Fingerprint className={`w-5 h-5 ${isConnecting ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
      <span>{isConnecting ? "Connecting..." : "Connect with Passkey"}</span>
    </button>
  );
}
