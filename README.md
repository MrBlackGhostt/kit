# Lazorkit SDK Demo - Passkey-Powered Solana Wallet

> A modern, production-ready example showcasing how to build a Solana wallet with passkey authentication and gasless transactions using the Lazorkit SDK.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Devnet-blue)](https://your-demo-url.vercel.app)
[![Lazorkit](https://img.shields.io/badge/Powered%20by-Lazorkit-purple)](https://lazor.sh)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js%2016-black)](https://nextjs.org)

## 🌟 Overview

This project demonstrates the power of Lazorkit SDK by building a complete Solana wallet interface **without requiring users to install browser extensions or manage seed phrases**. Users simply authenticate with their fingerprint or Face ID, and they're ready to transact on Solana.

### Why Lazorkit?

Traditional blockchain UX requires:
- ❌ Installing 3rd party wallet extensions
- ❌ Writing down 12-24 word seed phrases
- ❌ Managing private keys
- ❌ Paying gas fees for every transaction

Lazorkit enables:
- ✅ Passkey authentication (fingerprint/Face ID)
- ✅ No browser extensions needed
- ✅ Gasless transactions via smart wallets
- ✅ Seamless onboarding in seconds

## ✨ Features Demonstrated

- 🔐 **Passkey Authentication** - Login with biometrics, no seed phrases
- ⚡ **Gasless Transactions** - Send SOL without worrying about fees
- 💼 **Smart Wallet Integration** - Solana's native passkey support
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- 🎨 **Modern UI/UX** - Clean, professional interface with Tailwind CSS
- 📊 **Real-time Balance** - Auto-updating wallet balances
- 🔄 **Transaction Management** - Send SOL with retry logic
- 📋 **Code Examples** - Interactive code snippets with syntax highlighting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- A modern browser with passkey support (Chrome, Safari, Edge)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/lazorkit-demo.git
cd lazorkit-demo
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Run the development server**
```bash
npm run dev
# or
bun dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

That's it! No additional configuration needed. The demo is pre-configured to work with Solana Devnet.

## 📖 Step-by-Step Tutorials

### Tutorial 1: Setting Up Passkey Authentication

Learn how to integrate Lazorkit's passkey authentication in your Next.js app.

#### Step 1: Install Lazorkit SDK

```bash
npm install @lazorkit/wallet @solana/web3.js
```

#### Step 2: Configure the Provider

Wrap your app with `LazorkitProvider` in your root layout or page:

```typescript
// app/page.tsx
import { LazorkitProvider } from "@lazorkit/wallet";

const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

export default function App() {
  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={{
        paymasterUrl: CONFIG.PAYMASTER.paymasterUrl,
      }}
    >
      <YourApp />
    </LazorkitProvider>
  );
}
```

#### Step 3: Create a Connect Button

```typescript
// components/ConnectButton.tsx
import { useWallet } from "@lazorkit/wallet";

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting } = useWallet();

  if (isConnected) {
    return (
      <button onClick={() => disconnect()}>
        Disconnect
      </button>
    );
  }

  return (
    <button onClick={() => connect()} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect with Passkey"}
    </button>
  );
}
```

When users click "Connect with Passkey," their browser will prompt them to authenticate using their device's biometric sensor (fingerprint, Face ID, etc.). A smart wallet is automatically created and secured by the passkey.

**Key Points:**
- No seed phrase generation or management
- Private keys secured by device hardware
- Works across devices with passkey sync (iCloud Keychain, Google Password Manager)

---

### Tutorial 2: Implementing Gasless Transactions

Learn how to send SOL without requiring users to pay gas fees.

#### Step 1: Access the Wallet

```typescript
import { useWallet } from "@lazorkit/wallet";

const { smartWalletPubkey, signAndSendTransaction } = useWallet();
```

#### Step 2: Create a Transaction

```typescript
import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

const recipientAddress = new PublicKey("RECIPIENT_ADDRESS_HERE");
const amountInSol = 0.1;

const transferInstruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: recipientAddress,
  lamports: amountInSol * LAMPORTS_PER_SOL,
});
```

#### Step 3: Send the Transaction (Gasless!)

```typescript
const signature = await signAndSendTransaction({
  instructions: [transferInstruction],
  transactionOptions: {
    feeToken: "SOL",  // Paymaster handles the fees
    computeUnitLimit: 500_000,
  },
});

console.log("Transaction successful:", signature);
```

**How it works:**
1. User creates a transaction instruction
2. Lazorkit's smart wallet prepares the transaction
3. Paymaster service covers the gas fees
4. Transaction is signed with the user's passkey
5. Transaction is submitted to Solana

**Key Points:**
- Users never pay gas fees directly
- Seamless UX - no "approve transaction fee" prompts
- Paymaster is configurable (use your own or Lazorkit's)

---

### Tutorial 3: Fetching Real-time Balances

Create a custom hook to fetch and display wallet balances.

#### Step 1: Create the Balance Hook

```typescript
// hooks/useBalance.ts
import { useState, useEffect, useMemo } from "react";
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@lazorkit/wallet";

export const useBalance = () => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { smartWalletPubkey } = useWallet();

  const connection = useMemo(
    () => new Connection(clusterApiUrl("devnet"), "confirmed"),
    []
  );

  useEffect(() => {
    if (!smartWalletPubkey) {
      setBalance(0);
      return;
    }

    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        const bal = await connection.getBalance(smartWalletPubkey);
        setBalance(bal);
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [smartWalletPubkey, connection]);

  return {
    sol: balance / LAMPORTS_PER_SOL,
    lamports: balance,
    isLoading,
  };
};
```

#### Step 2: Use the Hook in Your Component

```typescript
export default function WalletDashboard() {
  const { sol, lamports, isLoading } = useBalance();
  const { smartWalletPubkey } = useWallet();

  return (
    <div>
      <h2>Balance: {sol.toFixed(4)} SOL</h2>
      <p>Address: {smartWalletPubkey?.toBase58()}</p>
    </div>
  );
}
```

**Key Points:**
- Balance updates automatically when wallet connects
- Handles loading states properly
- Returns both SOL and lamport values

---

## 🏗️ Project Structure

```
lazorkit-demo/
├── app/
│   ├── components/
│   │   ├── home.tsx              # Main dashboard with hero & features
│   │   ├── ConnectButton.tsx     # Passkey authentication button
│   │   ├── BalanceCard.tsx       # Wallet balance display
│   │   ├── send.tsx              # Send SOL component
│   │   ├── CodeBlock.tsx         # Syntax-highlighted code display
│   │   └── PageTabs.tsx          # Code example tabs
│   ├── hooks/
│   │   └── useBalance.ts         # Custom hook for balance fetching
│   ├── page.tsx                  # Root page with LazorkitProvider
│   ├── layout.tsx                # App layout
│   └── globals.css               # Global styles
├── components/ui/                # Shadcn UI components
├── lib/
│   ├── utils.ts                  # Utility functions
│   ├── tabConfig.ts              # Code example configuration
│   └── CodeSnippet.ts            # Code snippets for display
├── public/                       # Static assets
└── package.json
```

## 🎨 UI Components

The demo uses modern, responsive components built with:
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - High-quality component primitives
- **Lucide Icons** - Beautiful icon set
- **React Syntax Highlighter** - Code display with syntax highlighting

All components are fully responsive and work seamlessly on mobile, tablet, and desktop.

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file for custom configuration:

```env
# Solana RPC (defaults to Devnet)
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com

# Lazorkit Portal
NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh

# Paymaster URL
NEXT_PUBLIC_PAYMASTER_URL=https://kora.devnet.lazorkit.com
```

### Using Mainnet

To switch to mainnet, update the configuration in `app/page.tsx`:

```typescript
const CONFIG = {
  RPC_URL: "https://api.mainnet-beta.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.mainnet.lazorkit.com", // Update to mainnet
  },
};
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/lazorkit-demo)

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- Railway
- Render
- AWS Amplify
- Self-hosted with Node.js

## 📱 Browser Support

Passkeys require modern browser support:

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 108+           |
| Safari  | 16+            |
| Edge    | 108+           |
| Firefox | 119+           |

Mobile browsers (iOS Safari, Chrome Android) fully supported.

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Testing Locally

1. Run the dev server: `npm run dev`
2. Open http://localhost:3000
3. Click "Connect with Passkey"
4. Complete biometric authentication
5. Your wallet is created and ready!

To test transactions, you'll need Devnet SOL:
- Copy your wallet address from the UI
- Visit the [Solana Faucet](https://faucet.solana.com)
- Request 1-2 SOL for testing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this code for your own projects!

## 🔗 Links

- [Lazorkit Documentation](https://docs.lazorkit.com)
- [Lazorkit SDK on NPM](https://www.npmjs.com/package/@lazorkit/wallet)
- [Solana Documentation](https://docs.solana.com)
- [Live Demo](https://your-demo-url.vercel.app)

## 💬 Support

- Create an issue in this repository
- Join the [Lazorkit Discord](https://discord.gg/lazorkit)
- Follow [@lazorkit](https://twitter.com/lazorkit) on Twitter/X

---

**Built for the Lazorkit SDK Integration Bounty**

This project demonstrates production-ready integration of Lazorkit SDK features including passkey authentication, smart wallet management, and gasless transactions on Solana.
