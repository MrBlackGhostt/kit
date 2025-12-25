import { useMemo, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@lazorkit/wallet";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/";

const Send = () => {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();

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
    try {
      setError("");
      if (!smartWalletPubkey) throw new Error("Wallet not connected");
      if (!toPubkey) throw new Error("Invalid recipient address");
      if (!lamports) throw new Error("Invalid amount");

      setSending(true);

      const transferIx = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey,
        lamports,
      });

      const signature = await signAndSendTransaction({
        instructions: [transferIx],
        transactionOptions: { feeToken: "SOL", computeUnitLimit: 200_000 },
      });

      console.log(`✅ Transaction successful: ${signature}`);
    } catch (e: any) {
      setError(e?.message ?? "Transfer failed");
    } finally {
      setSending(false);
    }
  };

  const disabled = sending || !smartWalletPubkey || !toPubkey || !lamports;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-indigo-500/15 px-3 py-2 text-sm font-semibold text-indigo-100 shadow-sm transition
                     hover:bg-indigo-500/25 hover:border-indigo-400/30
                     active:scale-[0.99]
                     focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        >
          Send
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[92vw] max-w-sm rounded-2xl border border-slate-800 bg-slate-950/95 p-4 text-slate-100 shadow-xl"
      >
        <div className="space-y-3">
          <div>
            <div className="text-xs text-slate-400">Recipient</div>
            <input
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="Public key"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400/40"
            />
          </div>

          <div>
            <div className="text-xs text-slate-400">Amount (SOL)</div>
            <input
              value={amountSol}
              onChange={(e) => setAmountSol(e.target.value)}
              inputMode="decimal"
              placeholder="0.01"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400/40"
            />
          </div>

          {error ? <div className="text-xs text-red-300">{error}</div> : null}

          <button
            onClick={transfer}
            disabled={disabled}
            className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition
                       hover:bg-indigo-400
                       disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send SOL"}
          </button>

          <div className="text-[11px] text-slate-500">
            Uses Lazorkit smart wallet signing.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Send;
