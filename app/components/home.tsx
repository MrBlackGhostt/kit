"use client";
import { useWallet } from "@lazorkit/wallet";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";

import Send from "./send";
import { ConnectButton } from "./ConnectButton";

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

                <div className={`text-right   `}>
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
