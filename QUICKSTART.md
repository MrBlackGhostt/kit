# Quick Start Cheat Sheet

One-page reference for getting up and running with Lazorkit SDK.

## 🚀 Installation (2 minutes)

```bash
# Clone the repo
git clone https://github.com/yourusername/lazorkit-demo.git
cd lazorkit-demo

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:3000 - you're done! 🎉

## 🔑 Key Files to Understand

| File | Purpose |
|------|---------|
| `app/page.tsx` | LazorkitProvider configuration |
| `app/components/ConnectButton.tsx` | Passkey authentication |
| `app/components/send.tsx` | Gasless transaction example |
| `app/hooks/useBalance.ts` | Balance fetching hook |

## 📝 Essential Code Snippets

### 1. Setup Provider (5 lines)

```typescript
<LazorkitProvider
  rpcUrl="https://api.devnet.solana.com"
  portalUrl="https://portal.lazor.sh"
  paymasterConfig={{ paymasterUrl: "https://kora.devnet.lazorkit.com" }}
>
  <YourApp />
</LazorkitProvider>
```

### 2. Connect Button (3 lines)

```typescript
const { connect, isConnected } = useWallet();

return (
  <button onClick={connect}>
    {isConnected ? "Connected" : "Connect with Passkey"}
  </button>
);
```

### 3. Send Transaction (10 lines)

```typescript
const { smartWalletPubkey, signAndSendTransaction } = useWallet();

const transferIx = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: recipientPubkey,
  lamports: amount * LAMPORTS_PER_SOL,
});

const signature = await signAndSendTransaction({
  instructions: [transferIx],
  transactionOptions: { feeToken: "SOL", computeUnitLimit: 500_000 },
});
```

### 4. Get Balance (5 lines)

```typescript
const connection = new Connection(clusterApiUrl("devnet"));
const balance = await connection.getBalance(smartWalletPubkey);
const sol = balance / LAMPORTS_PER_SOL;

console.log(`Balance: ${sol} SOL`);
```

## 🎯 Common Tasks

### Get Test SOL
1. Copy your wallet address from UI
2. Go to https://faucet.solana.com
3. Paste address and request 1 SOL

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Switch to Mainnet
Change in `app/page.tsx`:
```typescript
RPC_URL: "https://api.mainnet-beta.solana.com"
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Passkey not working" | Ensure HTTPS (localhost is OK) |
| "Transaction failed" | Check you have SOL in wallet |
| "Connection error" | Verify RPC URL is correct |
| "Build failed" | Clear .next and node_modules |

## 📚 Documentation Map

```
README.md                           ← Start here
├── Quick Start                     ← 5-minute setup
├── Tutorial 1: Passkey Auth        ← Learn authentication
├── Tutorial 2: Gasless Txns        ← Learn transactions  
└── Tutorial 3: Balance Fetching    ← Learn data fetching

docs/TUTORIAL_PASSKEY_AUTH.md      ← Deep dive: Authentication
docs/TUTORIAL_GASLESS_TRANSACTIONS.md ← Deep dive: Transactions
docs/DEPLOYMENT.md                  ← Deploy to production
docs/BOUNTY_CHECKLIST.md           ← Bounty submission guide
CONTRIBUTING.md                     ← Contributing guide
```

## 🎨 UI Components Overview

```
HomePage
├── Hero Section (when not connected)
│   ├── Value proposition
│   ├── Feature pills
│   └── Feature cards
├── Header
│   ├── Network selector
│   └── ConnectButton
├── WalletDashboard (when connected)
│   └── BalanceCard
│       ├── Balance display
│       ├── Receive (QR code dialog)
│       ├── Send (transaction modal)
│       ├── Swap (disabled)
│       └── Buy (disabled)
└── Code Examples (tabs)
```

## 🔐 useWallet Hook Reference

```typescript
const {
  connect,              // () => Promise<void>
  disconnect,           // () => void
  isConnected,          // boolean
  isConnecting,         // boolean
  wallet,               // Wallet | null
  smartWalletPubkey,    // PublicKey | null
  signAndSendTransaction, // (opts) => Promise<string>
} = useWallet();
```

## 💡 Pro Tips

1. **Always validate inputs** before sending transactions
2. **Use retry logic** for network failures
3. **Show loading states** during async operations
4. **Handle errors gracefully** with user-friendly messages
5. **Test on devnet** before mainnet

## 🚦 Development Workflow

```bash
# Daily workflow
npm run dev        # Start server
# Make changes
# Test in browser
npm run build      # Verify build works
git add .
git commit -m "feat: your feature"
git push
```

## 📦 Tech Stack at a Glance

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lazorkit SDK** - Wallet/auth
- **Solana Web3.js** - Blockchain
- **Shadcn UI** - Components

## 🎓 Learning Path

1. **Day 1**: Run the app, connect wallet ✅
2. **Day 2**: Read Tutorial 1, understand passkeys ✅
3. **Day 3**: Read Tutorial 2, send test transaction ✅
4. **Day 4**: Customize UI, add your branding ✅
5. **Day 5**: Deploy to production! ✅

## 🔗 Quick Links

- [Live Demo](#) - See it in action
- [Lazorkit Docs](https://docs.lazorkit.com) - Official docs
- [Solana Devnet Faucet](https://faucet.solana.com) - Get test SOL
- [Solana Explorer](https://explorer.solana.com) - View transactions

---

**Need more details?** Check the full README.md or specific tutorial files.

**Ready to ship?** See docs/DEPLOYMENT.md for production deployment.
