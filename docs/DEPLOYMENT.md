# Deployment Guide

This guide covers deploying your Lazorkit-powered Solana app to production.

## Table of Contents

- [Vercel (Recommended)](#vercel-recommended)
- [Netlify](#netlify)
- [Railway](#railway)
- [Self-Hosted](#self-hosted)
- [Environment Variables](#environment-variables)
- [Production Checklist](#production-checklist)

## Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps.

### Deploy via GitHub

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Configure Environment Variables**
   
   In Vercel dashboard, add:
   
   ```
   NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
   NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh
   NEXT_PUBLIC_PAYMASTER_URL=https://your-paymaster-url.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes
   - Your app is live! 🎉

### Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Netlify

### Via GitHub

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repo

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   
   Add in Site Settings → Build & Deploy → Environment:
   ```
   NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
   NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh
   NEXT_PUBLIC_PAYMASTER_URL=https://your-paymaster-url.com
   ```

4. **Deploy**

### Via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

## Railway

1. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure**
   ```
   Build Command: npm run build
   Start Command: npm start
   ```

3. **Add Environment Variables**
   
   In Variables section:
   ```
   NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
   NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh
   NEXT_PUBLIC_PAYMASTER_URL=https://your-paymaster-url.com
   ```

4. **Deploy**
   - Railway automatically deploys on push

## Self-Hosted

### With Node.js

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Use a process manager**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start with PM2
   pm2 start npm --name "lazorkit-app" -- start
   
   # Enable auto-restart on reboot
   pm2 startup
   pm2 save
   ```

### With Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

2. **Build and run**
   ```bash
   docker build -t lazorkit-app .
   docker run -p 3000:3000 lazorkit-app
   ```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

### Required Variables

| Variable | Development | Production |
|----------|-------------|------------|
| `NEXT_PUBLIC_RPC_URL` | `https://api.devnet.solana.com` | `https://api.mainnet-beta.solana.com` |
| `NEXT_PUBLIC_PORTAL_URL` | `https://portal.lazor.sh` | `https://portal.lazor.sh` |
| `NEXT_PUBLIC_PAYMASTER_URL` | `https://kora.devnet.lazorkit.com` | Your mainnet paymaster |

### Optional Variables

```env
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Custom RPC for better performance
NEXT_PUBLIC_RPC_URL=https://rpc.helius.xyz/?api-key=YOUR_KEY

# Feature flags
NEXT_PUBLIC_ENABLE_SWAP=false
NEXT_PUBLIC_ENABLE_NFT=false
```

## Production Checklist

Before deploying to production:

### Security

- [ ] Environment variables are set correctly
- [ ] No sensitive keys in source code
- [ ] HTTPS is enabled
- [ ] Rate limiting implemented (if needed)
- [ ] Error messages don't expose sensitive info

### Performance

- [ ] Build is optimized (`npm run build` succeeds)
- [ ] Images are optimized
- [ ] Using production RPC endpoint
- [ ] Caching headers configured
- [ ] Bundle size is reasonable

### UX

- [ ] Loading states for all async operations
- [ ] Error handling with user-friendly messages
- [ ] Mobile responsive design tested
- [ ] Works on major browsers (Chrome, Safari, Firefox)
- [ ] Passkey authentication tested on multiple devices

### Monitoring

- [ ] Error tracking set up (Sentry, etc.)
- [ ] Analytics configured (GA, Plausible, etc.)
- [ ] Uptime monitoring enabled
- [ ] Transaction success/failure tracking

### Documentation

- [ ] README updated with live demo link
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] Deployment process documented

## Switching from Devnet to Mainnet

### 1. Update RPC URL

```typescript
// Before (Devnet)
const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  // ...
};

// After (Mainnet)
const CONFIG = {
  RPC_URL: "https://api.mainnet-beta.solana.com",
  // ...
};
```

### 2. Update Paymaster

Contact Lazorkit team for mainnet paymaster access, or set up your own:

```typescript
const CONFIG = {
  PAYMASTER: {
    paymasterUrl: "https://your-mainnet-paymaster.com",
  },
};
```

### 3. Update Explorer Links

```typescript
// Update devnet → mainnet in explorer URLs
const explorerUrl = `https://explorer.solana.com/tx/${signature}`;
// Remove ?cluster=devnet parameter
```

### 4. Test Thoroughly

- [ ] Test with small amounts first
- [ ] Verify transactions on mainnet explorer
- [ ] Check all features work correctly
- [ ] Monitor for errors

## Performance Optimization

### Use a Premium RPC

Free public RPCs can be slow. Consider:

- [Helius](https://helius.xyz)
- [QuickNode](https://quicknode.com)
- [Alchemy](https://alchemy.com)

```typescript
const CONFIG = {
  RPC_URL: "https://rpc.helius.xyz/?api-key=YOUR_KEY",
};
```

### Enable Caching

```typescript
// Next.js config
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

## Troubleshooting

### Build fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment variables not working

- Ensure variables start with `NEXT_PUBLIC_`
- Restart dev server after adding variables
- Check for typos in variable names
- Verify variables are set in deployment platform

### Passkeys not working in production

- Ensure you're using HTTPS (required for passkeys)
- Check browser compatibility
- Verify Portal URL is correct
- Test on multiple devices

## Support

Need help deploying?

- Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Contact Lazorkit Support
- Open an issue on GitHub

---

**Ready to deploy?** Start with Vercel for the easiest experience! 🚀
