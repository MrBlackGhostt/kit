"use client";
import { useMemo, useState } from "react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import { useWallet } from "@lazorkit/wallet";
//Shadcn ui
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";

const Send = () => {
  const { signAndSendTransaction, smartWalletPubkey, isLoading } = useWallet();

  const [toAddress, setToAddress] = useState("");
  const [amountSol, setAmountSol] = useState("0.34");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

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
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        if (!smartWalletPubkey) throw new Error("Wallet not connected");
        if (!toPubkey) throw new Error("Invalid recipient address");
        if (!lamports) throw new Error("Invalid amount");

        setSending(true);
        setError(""); // Clear previous errors

        const transferIx = SystemProgram.transfer({
          fromPubkey: smartWalletPubkey,
          toPubkey,
          lamports,
        });

        const signature = await signAndSendTransaction({
          instructions: [transferIx],
          transactionOptions: {
            feeToken: "SOL",
            computeUnitLimit: 500_000,
          },
        });

        console.log(`✅ Transaction successful: ${signature}`);
        toast("✅ Transaction successful!");
        setSending(false);
        return; // ✅ Exit on success
      } catch (e: any) {
        attempt++;

        // Check if error is retryable (blockhash expired)
        const isRetryable =
          e?.message?.includes("TransactionTooOld") ||
          e?.message?.includes("blockhash") ||
          e?.message?.includes("0x1783");

        if (isRetryable && attempt < MAX_RETRIES) {
          console.log(`🔄 Retry ${attempt}/${MAX_RETRIES}`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue; // Retry
        }

        // Non-retryable error or max retries reached
        const errorMsg = e?.message ?? "Transfer failed";
        setError(errorMsg);
        toast(`❌ Transaction failed: ${errorMsg}`);
        setSending(false);
        break; // Exit retry loop
      }
    }

    setSending(false);
  };

  // ✅ Move disabled logic outside transfer function
  const disabled = sending || !smartWalletPubkey || !toPubkey || !lamports;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          disabled={isLoading || sending}
          className="text-sm font-medium text-slate-200 w-full"
        >
          Send
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[92vw] max-w-md rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-xl p-6 text-slate-100 shadow-2xl"
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Send SOL</h3>
            <p className="text-xs text-slate-400">Transfer SOL to any Solana address</p>
          </div>

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
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
            />
            {amountSol && !lamports && (
              <p className="text-xs text-red-400 mt-1.5">Invalid amount</p>
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
      </PopoverContent>
    </Popover>
  );
};

export default Send;
