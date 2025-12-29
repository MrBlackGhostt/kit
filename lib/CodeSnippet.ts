import dedent from "dedent";

export const CodeSnippet = {
  page: dedent`"use client";

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
};`,
  homePage: dedent`"use client";
import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";

import Send from "./send";
import { ConnectButton } from "./ConnectButton";

import CodeBlock from "./CodeBlock";
import PageTabs from "./PageTabs";

const HomePage = () => {
  const [error, setError] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [net, setnet] = useState<string>("devnet");
  const [balanceLoading, setBalanceLoading] = useState(false);

  const {
    smartWalletPubkey,
    isConnected,
    isLoading,
    connect,
    wallet,
    disconnect,
  } = useWallet();

  const endpoint = useMemo(() => clusterApiUrl(net as any), [net]);

  const connection = useMemo(
    () => new Connection(endpoint, "confirmed"),
    [endpoint],
  );
  useEffect(() => {
    // if (!smartWalletPubkey) {
    //   setBalance(0);
    //   return;
    // }

    let cancelled = false;

    const getBalance = async () => {
      // try {
      setBalanceLoading(true);
      const bal = await connection.getBalance(smartWalletPubkey!);
      if (!cancelled) setBalance(bal);
      // }
      // finally {
      //   if (!cancelled) setBalanceLoading(false);
      // }
    };

    getBalance();
    return () => {
      cancelled = true;
    };
  }, [smartWalletPubkey, connection]);
  const sol = balance / LAMPORTS_PER_SOL;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto w-full max-w-2xl px-4 py-10">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Wallet Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Devnet • Confirmed connection
            </p>
          </div>
          {/* //Connect Button */}
          <ConnectButton />

          <select value={net} onChange={(e) => setnet(e.target.value)}>
            <option value="devnet">Devnet</option>
            <option value="mainnet-beta">MainNet</option>
            <option value="testnet">TestNet</option>
          </select>
        </div>

        {error !== "" ? (
          <div className="rounded-xl border border-red-900/60 bg-red-950/40 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : (
          <>
            {/* Balance card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-400">Balance</div>
                  <div className="mt-1 text-3xl font-semibold tabular-nums">
                    {sol.toFixed(4)}{" "}
                    <span className="text-base font-medium text-slate-400">
                      SOL
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Lamports</div>
                  <div className="mt-1 text-sm text-slate-300 tabular-nums">
                    {isLoading ? "Updating…" : balance}{" "}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <button className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900/60 active:scale-[0.99] transition">
                  Receive
                </button>

                {/* Keep your Send component exactly here */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 hover:bg-slate-900/60 transition">
                  <Send />
                </div>

                <button className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900/60 active:scale-[0.99] transition">
                  Swap
                </button>

                <button className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900/60 active:scale-[0.99] transition">
                  Buy
                </button>
              </div>
            </div>
            <div>
              <PageTabs />
            </div>
            {/* Optional footer row (UI-only) */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Tip: show address + copy button here</span>
              <span className="tabular-nums">Updated on render</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
`,
  connectButton: dedent`

import { useWallet } from "@lazorkit/wallet";
export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } =
    useWallet();

  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition cursor-pointer " +
    "focus:outline-none focus:ring-2 focus:ring-indigo-400/40 active:scale-[0.99] " +
    "disabled:cursor-not-allowed disabled:opacity-60"; // disabled + state variants [web:21]

  if (isConnected && wallet) {
    return (
      <button
        onClick={() => disconnect()}
        className={
          base +
          " border border-slate-800 bg-slate-950/40 text-slate-100 hover:bg-slate-900/60 "
        }
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Connected
      </button>
    );
  }

  return (
    <button
      onClick={() => connect()}
      disabled={isConnecting}
      className={
        base +
        " border border-indigo-400/20 bg-indigo-500/15 text-indigo-50 hover:bg-indigo-500/25 hover:border-indigo-400/30"
      }
    >
      <span
        className={
          "h-2 w-2 rounded-full " +
          (isConnecting ? "bg-amber-300" : "bg-indigo-300")
        }
      />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
`,
  send: dedent`
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
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue; // Retry
        }

        // Non-retryable error or max retries reached
        const errorMsg = e?.message ?? "Transfer failed";
        setError(errorMsg);
        toast("❌ Transaction failed");
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
            {sending ? <Spinner /> : null}
            {sending ? "Sending...SOL" : "Send  SOL"}
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
`,
};
