import { useState, useEffect, useMemo } from "react";
import {
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { useWallet } from "@lazorkit/wallet";

export const useBalance = () => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { smartWalletPubkey } = useWallet();

  const connection = useMemo(
    () => new Connection(clusterApiUrl("devnet"), "confirmed"),
    [],
  );
  useEffect(() => {
    let cancelled = false;
    console.log(`isLoading ${isLoading}`);
    if (!smartWalletPubkey) {
      setBalance(0);
      setIsLoading(!isLoading);
      return;
    }
    const getBalance = async () => {
      setIsLoading(true);
      try {
        const bal = await connection.getBalance(smartWalletPubkey);
        if (!cancelled) {
          setBalance(bal);
        }
      } catch (error) {
        return new Error("Error in getting the balance");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    getBalance();
    return () => {
      cancelled = true;
    };
  }, []);

  return { sol: balance / LAMPORTS_PER_SOL, lamports: balance, isLoading };
};
