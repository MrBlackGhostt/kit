// components/BalanceCard.tsx

import { QRCodeSVG } from "qrcode.react";
import { Copy, QrCode, Send as SendIcon, ArrowDownToLine, ArrowUpFromLine, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import Send from "./send";
import { useState } from "react";
import { toast } from "sonner";

export const BalanceCard = ({ sol, lamports, isLoading, address }: any) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
      {/* Balance Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-slate-400 mb-1">Total Balance</p>
            <h2 className="text-4xl sm:text-5xl font-bold tabular-nums text-white transition-opacity duration-300">
              {isLoading ? (
                <span className="text-slate-500">--</span>
              ) : (
                <>
                  {sol.toFixed(4)}
                  <span className="text-xl sm:text-2xl font-medium text-slate-400 ml-2">SOL</span>
                </>
              )}
            </h2>
            <p className="text-sm text-slate-500 mt-1 tabular-nums transition-opacity duration-300">
              {lamports.toLocaleString()} lamports
            </p>
          </div>
          
          {/* Address Display */}
          {address && (
            <div className="flex items-center gap-2">
              <button
                onClick={copyAddress}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-200"
              >
                <span className="font-mono text-sm text-slate-300">
                  {formatAddress(address)}
                </span>
                <Copy className={`w-4 h-4 transition-colors ${copied ? 'text-green-400' : 'text-slate-400 group-hover:text-indigo-400'}`} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 sm:p-8 border-t border-white/5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Receive Modal */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all duration-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <ArrowDownToLine className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-sm font-medium text-slate-200">Receive</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">Receive SOL</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-6 py-4">
                <div className="p-4 bg-white rounded-2xl shadow-lg">
                  <QRCodeSVG value={address || ""} size={200} />
                </div>
                <div className="w-full space-y-2">
                  <p className="text-xs text-slate-400 text-center">Your Wallet Address</p>
                  <div
                    onClick={copyAddress}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-800 hover:border-indigo-500/30 transition-all duration-200"
                  >
                    <span className="text-xs font-mono break-all text-slate-300">
                      {address}
                    </span>
                    <Copy className={`ml-3 flex-shrink-0 w-4 h-4 transition-colors ${copied ? 'text-green-400' : 'text-slate-400'}`} />
                  </div>
                  {copied && (
                    <p className="text-xs text-green-400 text-center">Copied!</p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Send Button */}
          <div className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all duration-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <ArrowUpFromLine className="w-5 h-5 text-indigo-400" />
            </div>
            <Send />
          </div>

          {/* Swap Button */}
          <button
            disabled
            className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/40 opacity-60 cursor-not-allowed"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-400">Swap</span>
          </button>

          {/* Buy Button */}
          <button
            disabled
            className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/40 opacity-60 cursor-not-allowed"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-pink-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">Buy</span>
          </button>
        </div>

        {/* Info Banner */}
        <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-300 mb-1">Gasless Transactions</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your smart wallet is powered by Lazorkit. Send SOL without worrying about transaction fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
