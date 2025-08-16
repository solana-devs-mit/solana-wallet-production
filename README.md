# Solana Wallet Integration

A modern, professional Solana wallet management application built with Next.js and Rust. Features secure wallet connections, transaction management, and real-time balance tracking on the Solana devnet.

![Solana Wallet Interface](https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-Backend-orange?style=for-the-badge&logo=rust&logoColor=white)

## ✨ Features

- **🔐 Secure Wallet Integration** - Connect with Phantom and other Solana wallets
- **💰 Real-time Balance Tracking** - View SOL balance with manual refresh capability
- **📤 Instant Transfers** - Send test SOL using wallet signing (no private keys stored)
- **📊 Transaction History** - View both transaction signatures and full transaction details
- **🎨 Professional UI** - Clean, modern interface with gradient backgrounds and smooth animations
- **🌐 Network Configuration** - Built-in devnet configuration with user guidance

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **Solana Wallet Adapter** - Wallet connection and transaction signing

### Backend
- **Rust** - High-performance backend
- **Actix Web** - Web framework
- **Solana SDK** - Blockchain interactions
- **Docker** - Containerized deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Rust 1.70+
- Docker (for deployment)
- Phantom wallet browser extension

### Frontend Setup

1. **Clone and install dependencies**
   \`\`\`bash
   git clone <your-repo-url>
   cd frontend
   npm install
   \`\`\`

2. **Configure environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update `.env.local`:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   \`\`\`

3. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

### Backend Setup

1. **Navigate to backend directory**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Run with Cargo**
   \`\`\`bash
   cargo run
   \`\`\`

3. **Or build with Docker**
   \`\`\`bash
   docker build -t solana-wallet .
   docker run -p 8080:8080 solana-wallet
   \`\`\`

## 📁 Project Structure

\`\`\`
solana-prod-wallet/
├── frontend/                   # Next.js Frontend Application
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Solana provider
│   │   ├── page.tsx            # Main application page
│   │   └── globals.css         # Global styles and theme
│   ├── components/
│   │   ├── solana-provider.tsx # Wallet adapter configuration
│   │   ├── wallet-button.tsx   # Wallet connection component
│   │   ├── wallet-info.tsx     # Balance and address display
│   │   ├── send-sol-form.tsx   # Transaction form
│   │   ├── transaction-history.tsx # Transaction viewer
│   │   ├── theme-provider.tsx  # Theme context provider
│   │   └── ui/                 # shadcn/ui components
│   │       ├── button.tsx      # Button component
│   │       ├── card.tsx        # Card component
│   │       ├── input.tsx       # Input component
│   │       ├── alert.tsx       # Alert component
│   │       └── ...             # 40+ other UI components
│   ├── hooks/
│   │   ├── use-mobile.ts       # Mobile detection hook
│   │   └── use-toast.ts        # Toast notification hook
│   ├── lib/
│   │   ├── api.ts              # Backend API utilities
│   │   └── utils.ts            # General utility functions
│   ├── public/
│   │   └── placeholder.*       # Placeholder images and assets
│   ├── .env.example            # Environment variables template
│   ├── package.json            # Dependencies and scripts
│   ├── next.config.mjs         # Next.js configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── components.json         # shadcn/ui configuration
├── backend/                    # Rust Backend Application
│   ├── src/
│   │   ├── main.rs             # Server configuration and CORS
│   │   └── handlers.rs         # API endpoints implementation
│   ├── Cargo.toml              # Rust dependencies
│   └── Dockerfile              # Container configuration
└── README.md                   # Project documentation
\`\`\`

## 🔧 Configuration

### Wallet Setup
1. Install Phantom wallet extension
2. Create or import a wallet
3. Switch to **Devnet** in Phantom settings:
   - Settings → Developer Settings → Change Network → Devnet
4. Get test SOL from [Solana Faucet](https://faucet.solana.com/)

### Environment Variables

**Frontend (.env.local)**
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080  # Backend URL
\`\`\`

**Backend**
- No additional environment variables required for basic functionality
- Optionally configure custom RPC endpoints in `main.rs`

## 🌐 Deployment

### Backend (Azure Container Instances)
1. Build Docker image:
   \`\`\`bash
   docker build -t solana-wallet .
   \`\`\`

2. Deploy to Azure Container Instances via Azure Portal
3. Note the public URL for frontend configuration

### Frontend (Azure Static Web Apps)
1. Connect GitHub repository to Azure Static Web Apps
2. Configure build settings:
   - App location: `/frontend`
   - Build location: `out` or `.next`
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/balance/{pubkey}` | Get wallet balance |
| GET | `/transaction/{pubkey}` | Get transaction signatures |
| GET | `/transaction/full/{pubkey}` | Get full transaction history |

## 🎨 Design Features

- **Professional Color Palette** - Cyan and amber theme for trustworthy appearance
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Gradient Backgrounds** - Sophisticated visual effects with decorative elements
- **Typography** - Inter and JetBrains Mono fonts for excellent readability
- **Component Consistency** - Unified design language across all components

## 🔒 Security

- **No Private Key Storage** - All transactions signed by user's wallet
- **Devnet Only** - Safe testing environment with test SOL
- **CORS Configuration** - Proper cross-origin request handling
- **Input Validation** - Comprehensive validation on both frontend and backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Solana Labs](https://solana.com/) for the blockchain infrastructure
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter) for wallet integration
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Vercel](https://vercel.com/) for Next.js framework

---

**Built with ❤️ for the Solana ecosystem**
