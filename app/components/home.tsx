"use client";
import { SendSolButton } from "./sendi";
import { useWallet } from "@lazorkit/wallet";
import {
  Connection,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import { log } from "console";
import { useEffect, useState } from "react";

//import fun
import Send from "./send";

const HomePage = () => {
  const [error, setError] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const {
    signAndSendTransaction,
    smartWalletPubkey,
    isConnected,
    isLoading,
    connect,
    wallet,
    disconnect,
  } = useWallet();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  useEffect(() => {
    const getBalance = async () => {
      const balance = await connection.getBalance(smartWalletPubkey!);
      console.log(`balance ${balance}`);
      setBalance(balance);
    };
    getBalance();
  }, [smartWalletPubkey]);

  if (!connection) {
    throw new Error("Error in connecting the rpc");
    setError("Error in connecting the rpc");
  }

  return (
    <div>
      {error != "" ? (
        <div>{error}</div>
      ) : (
        <>
          {" "}
          <div>
            <button>receive</button>
            <Send />
            <button>swap</button>
            <button>Buy</button>
          </div>
        </>
      )}
      <div>Balance{balance / LAMPORTS_PER_SOL} </div>
    </div>
  );
};

export default HomePage;
