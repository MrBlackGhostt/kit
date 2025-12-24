import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";

import { useWallet } from "@lazorkit/wallet";

const Send = () => {
  const { wallet, signAndSendTransaction, smartWalletPubkey } = useWallet();
  const to = new PublicKey("F5FjAAU6y22eUisRo1dzm5L6ENB4XTNMUGxJrYKsUBvY");

  const transfer = async () => {
    console.log(`enter transfer`);
    const inx = SystemProgram.transfer({
      fromPubkey: smartWalletPubkey!,
      toPubkey: to,
      lamports: 0.34 * LAMPORTS_PER_SOL,
    });
    console.log(`inx: ${inx}`);
    const signature = await signAndSendTransaction({
      instructions: [inx],
      transactionOptions: {
        feeToken: "USDC",
        computeUnitLimit: 500_000,
      },
    });
    console.log(`signature:- ${signature}`);
    console.log(`THe send signature ${signature}`);
  };

  return (
    <div>
      <button onClick={() => transfer()}>Send 00.9</button>
    </div>
  );
};

export default Send;
