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
    let intervalId: NodeJS.Timeout;
    
    if (!smartWalletPubkey) {
      setBalance(0);
      setIsLoading(false);
      return;
    }
    
    const getBalance = async (showLoading = true) => {
      // Only show loading on first fetch
      if (showLoading && balance === 0) {
        setIsLoading(true);
      }
      
      try {
        const bal = await connection.getBalance(smartWalletPubkey);
        if (!cancelled) {
          setBalance(bal);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    
    // Initial fetch
    getBalance(true);
    
    // Poll for balance updates every 10 seconds
    intervalId = setInterval(() => {
      getBalance(false);
    }, 10000);
    
    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [smartWalletPubkey?.toBase58(), connection]);

  return { 
    sol: balance / LAMPORTS_PER_SOL, 
    lamports: balance, 
    isLoading 
  };
};
