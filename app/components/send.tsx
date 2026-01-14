"use client";
import { useMemo, useState } from "react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { useWallet } from "@lazorkit/wallet";
import { useBalance } from "../hooks/useBalance";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { ArrowUpFromLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

const Send = () => {
  const { signAndSendTransaction, smartWalletPubkey, isLoading } = useWallet();
  const { sol: balance } = useBalance();

  const [toAddress, setToAddress] = useState("");
  const [amountSol, setAmountSol] = useState("0.01");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const toPubkey = useMemo(() => {
    try {
      if (!toAddress.trim()) return null;
      return new PublicKey(toAddress.trim());
    } catch {
      return null;
    }
  }, [toAddress]);

  const lamports = useMemo(() => {
    const n = Number.parseFloat(amountSol);
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.round(n * LAMPORTS_PER_SOL);
  }, [amountSol]);

  const transfer = async () => {
    try {
      if (!smartWalletPubkey) throw new Error("Wallet not connected");
      if (!toPubkey) throw new Error("Invalid recipient address");
      if (!lamports) throw new Error("Invalid amount");

      setSending(true);
      setError("");

      console.log("Preparing transfer:", {
        from: smartWalletPubkey.toBase58(),
        to: toPubkey.toBase58(),
        lamports,
        sol: parseFloat(amountSol),
      });

      // Send transaction - Lazorkit handles the signing and paymaster
      const signature = await signAndSendTransaction({
        instructions: [
          SystemProgram.transfer({
            fromPubkey: smartWalletPubkey,
            toPubkey,
            lamports,
          }),
        ],
      });

      console.log(`✅ Transaction sent: ${signature}`);
      console.log(`View on explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      
      toast.success(`✅ Sent ${amountSol} SOL successfully!`);
      
      // Reset and close
      setToAddress("");
      setAmountSol("0.01");
      setOpen(false);
      setSending(false);
    } catch (e: any) {
      console.error("❌ Transaction failed:", e);
      
      let errorMsg = "Transaction failed";
      
      // Better error messages
      if (e?.message?.includes("0x1")) {
        errorMsg = "Insufficient lamports for rent exemption. Try sending at least 0.001 SOL more.";
      } else if (e?.message?.includes("0x2")) {
        errorMsg = "Custom program error 0x2. The recipient account may not exist or have enough rent. Try a smaller amount like 0.01 SOL.";
      } else if (e?.message?.includes("0x3")) {
        errorMsg = "The account you're sending to doesn't have enough for rent. Try sending at least 0.001 SOL.";
      } else if (e?.message?.includes("User rejected") || e?.message?.includes("User denied")) {
        errorMsg = "You cancelled the transaction";
      } else if (e?.message) {
        // Show the actual error message
        errorMsg = e.message;
      }
      
      setError(errorMsg);
      toast.error(`❌ ${errorMsg}`);
      setSending(false);
    }
  };

  const disabled = sending || !smartWalletPubkey || !toPubkey || !lamports;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900/60 hover:border-indigo-500/30 transition-all duration-200 w-full">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <ArrowUpFromLine className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-sm font-medium text-slate-200">Send</span>
        </button>
      </DialogTrigger>

      <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Send SOL</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">
              Recipient Address
            </label>
            <input
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="Enter Solana address"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
            />
            {toAddress && !toPubkey && (
              <p className="text-xs text-red-400 mt-1.5">Invalid Solana address</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 mb-2 block">
              Amount (SOL)
            </label>
            <input
              value={amountSol}
              onChange={(e) => setAmountSol(e.target.value)}
              inputMode="decimal"
              placeholder="0.01"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
            />
            {amountSol && !lamports && (
              <p className="text-xs text-red-400 mt-1.5">Invalid amount</p>
            )}
            {balance !== undefined && (
              <p className="text-xs text-slate-500 mt-1.5">
                Available: {balance.toFixed(4)} SOL
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          <button
            onClick={transfer}
            disabled={disabled}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200
                       hover:from-indigo-400 hover:to-purple-500
                       disabled:cursor-not-allowed disabled:opacity-50 disabled:from-slate-700 disabled:to-slate-700
                       active:scale-[0.98]"
          >
            {sending ? (
              <>
                <Spinner />
                <span>Sending {amountSol} SOL...</span>
              </>
            ) : (
              <span>Send {amountSol} SOL</span>
            )}
          </button>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
            <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Transaction is gasless and secured by your Lazorkit smart wallet with passkey authentication.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Send;
