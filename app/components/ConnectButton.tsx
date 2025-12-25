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
        Disconnect ({wallet.smartWallet.slice(0, 6)}...)
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
