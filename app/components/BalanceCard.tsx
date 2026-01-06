// components/BalanceCard.tsx

import { QRCodeSVG } from "qrcode.react";
import { Copy, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import Send from "./send";

export const BalanceCard = ({ sol, lamports, isLoading, address }: any) => {
  const copyAddress = () => {
    if (address) navigator.clipboard.writeText(address);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm text-slate-400">Balance</p>
          <h2 className="text-3xl font-semibold tabular-nums">
            {sol.toFixed(4)}{" "}
            <span className="text-base font-medium text-slate-500">SOL</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Receive Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900/60 transition">
              <QrCode size={16} /> Receive
            </button>
          </DialogTrigger>
          <DialogContent className="bg-slate-950 border-slate-800 text-slate-100">
            <DialogHeader>
              <DialogTitle className="text-center">Deposit SOL</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-6 py-4">
              <div className="p-3 bg-white rounded-lg">
                <QRCodeSVG value={address || ""} size={180} />
              </div>
              <div className="w-full">
                <div
                  onClick={copyAddress}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-800 transition"
                >
                  <span className="text-[10px] font-mono break-all">
                    {address}
                  </span>
                  <Copy size={14} className="ml-2 text-slate-500" />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {["Swap", "Buy"].map((label) => (
          <button
            key={label}
            className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900/60 transition"
          >
            {label}
          </button>
        ))}
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 hover:bg-slate-900/60 transition">
          <Send />
        </div>
      </div>
    </div>
  );
};
