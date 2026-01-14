# Tutorial: Implementing Passkey Authentication with Lazorkit

## Introduction

In this tutorial, you'll learn how to implement passwordless authentication for your Solana dapp using Lazorkit's passkey technology. This eliminates the need for seed phrases and browser wallet extensions, providing a seamless Web2-like experience for your users.

## What are Passkeys?

Passkeys are a modern authentication standard that uses public-key cryptography secured by your device's biometric sensors (fingerprint, Face ID, etc.). They're:

- **More secure** than passwords or seed phrases
- **Phishing-resistant** - can't be stolen or leaked
- **Device-backed** - private keys never leave your device
- **Sync-enabled** - work across devices via iCloud Keychain or Google Password Manager

## Prerequisites

- Node.js 18+ installed
- Basic knowledge of React/Next.js
- A modern browser with passkey support

## Step 1: Project Setup

Create a new Next.js project:

```bash
npx create-next-app@latest my-lazorkit-app
cd my-lazorkit-app
```

Install required dependencies:

```bash
npm install @lazorkit/wallet @solana/web3.js
```

## Step 2: Configure Lazorkit Provider

The `LazorkitProvider` is the foundation of your passkey-enabled app. It handles wallet creation, authentication, and transaction signing.

Create or update `app/page.tsx`:

```typescript
"use client";
import { LazorkitProvider } from "@lazorkit/wallet";

const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

export default function Home() {
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

### Configuration Explained

- **rpcUrl**: Solana RPC endpoint (use devnet for testing)
- **portalUrl**: Lazorkit's authentication portal
- **paymasterConfig**: Configuration for gasless transactions

## Step 3: Create the Connect Button

Create `components/ConnectButton.tsx`:

```typescript
"use client";
import { useWallet } from "@lazorkit/wallet";
import { Fingerprint, LogOut } from "lucide-react";

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting } = useWallet();

  if (isConnected) {
    return (
      <button onClick={() => disconnect()}>
        <span>Connected</span>
        <LogOut className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button 
      onClick={() => connect()} 
      disabled={isConnecting}
    >
      <Fingerprint className="w-5 h-5" />
      <span>
        {isConnecting ? "Connecting..." : "Connect with Passkey"}
      </span>
    </button>
  );
}
```

### The useWallet Hook

The `useWallet` hook provides:

- `connect()` - Initiates passkey authentication
- `disconnect()` - Logs out the user
- `isConnected` - Boolean connection status
- `isConnecting` - Boolean loading state
- `wallet` - The connected wallet object
- `smartWalletPubkey` - The user's Solana public key

## Step 4: Use the Connect Button

Add the button to your app:

```typescript
// app/page.tsx
import { ConnectButton } from "@/components/ConnectButton";

function YourApp() {
  return (
    <div>
      <h1>My Solana App</h1>
      <ConnectButton />
    </div>
  );
}
```

## Step 5: Display User Information

Once connected, you can access the user's wallet:

```typescript
"use client";
import { useWallet } from "@lazorkit/wallet";

export function WalletInfo() {
  const { smartWalletPubkey, isConnected } = useWallet();

  if (!isConnected) {
    return <p>Not connected</p>;
  }

  return (
    <div>
      <h2>Your Wallet</h2>
      <p>Address: {smartWalletPubkey?.toBase58()}</p>
    </div>
  );
}
```

## Step 6: Test the Integration

1. Start your dev server:
```bash
npm run dev
```

2. Open http://localhost:3000 in your browser

3. Click "Connect with Passkey"

4. Your browser will prompt you to:
   - Create a new passkey (first time)
   - Authenticate with fingerprint/Face ID

5. Upon success, you'll see your wallet address!

## Understanding What Happens

When a user clicks "Connect with Passkey":

1. **Browser prompts for biometric authentication**
   - Fingerprint scanner activates
   - Or Face ID on supported devices
   - Or PIN/password as fallback

2. **Passkey is created/verified**
   - A cryptographic key pair is generated
   - Private key stays on your device (in secure enclave)
   - Public key is registered with Lazorkit

3. **Smart wallet is created**
   - A Solana smart wallet is deployed
   - Controlled by the passkey
   - Supports gasless transactions

4. **User is authenticated**
   - No seed phrase to remember
   - No browser extension required
   - Works across devices with passkey sync

## Advanced: Handling Connection States

Create a more robust component:

```typescript
"use client";
import { useWallet } from "@lazorkit/wallet";
import { useEffect } from "react";

export function Dashboard() {
  const { 
    connect, 
    disconnect, 
    isConnected, 
    isConnecting,
    smartWalletPubkey 
  } = useWallet();

  useEffect(() => {
    if (isConnected) {
      console.log("Wallet connected:", smartWalletPubkey?.toBase58());
    }
  }, [isConnected, smartWalletPubkey]);

  if (isConnecting) {
    return <div>Authenticating with passkey...</div>;
  }

  if (!isConnected) {
    return (
      <button onClick={connect}>
        Connect with Passkey
      </button>
    );
  }

  return (
    <div>
      <h2>Welcome!</h2>
      <p>Wallet: {smartWalletPubkey?.toBase58()}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

## Best Practices

### 1. Error Handling

Always handle potential errors:

```typescript
const handleConnect = async () => {
  try {
    await connect();
  } catch (error) {
    console.error("Connection failed:", error);
    // Show user-friendly error message
  }
};
```

### 2. Loading States

Provide feedback during authentication:

```typescript
{isConnecting && <Spinner />}
{isConnecting ? "Authenticating..." : "Connect"}
```

### 3. Persistence

Lazorkit automatically persists sessions. Users won't need to re-authenticate on every page refresh.

### 4. Fallback UI

Always provide a fallback for browsers without passkey support:

```typescript
const supportsPasskeys = window?.PublicKeyCredential !== undefined;

if (!supportsPasskeys) {
  return <div>Your browser doesn't support passkeys</div>;
}
```

## Troubleshooting

### "Passkey creation failed"

**Cause**: Browser doesn't support passkeys or user denied permission

**Solution**: 
- Ensure you're using a modern browser (Chrome 108+, Safari 16+)
- Check that you're on HTTPS (localhost is okay for development)
- User must complete biometric authentication

### "Connection timeout"

**Cause**: Network issues or RPC endpoint unavailable

**Solution**:
- Check your internet connection
- Verify the RPC URL is correct
- Try a different Solana RPC provider

### "Wallet not showing"

**Cause**: Component rendering before connection completes

**Solution**:
```typescript
if (!isConnected || !smartWalletPubkey) {
  return <div>Loading...</div>;
}
```

## Next Steps

Now that you have passkey authentication working:

1. Add balance fetching (see Tutorial 3)
2. Implement gasless transactions (see Tutorial 2)
3. Build your dapp features!

## Resources

- [Passkey Standards (WebAuthn)](https://webauthn.io)
- [Lazorkit Documentation](https://docs.lazorkit.com)
- [Browser Compatibility](https://caniuse.com/passkeys)

---

**Congratulations!** You've successfully implemented passkey authentication for your Solana dapp. Your users can now enjoy a Web2-like experience without managing seed phrases or installing wallet extensions.
