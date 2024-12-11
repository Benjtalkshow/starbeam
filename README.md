# StarBeam

StarBeam is a smart Stellar wallet built as a Telegram mini app.
It's tied to your Telegram account and allows you to send tokens to other Telegram users and to regular Stellar wallets.
It also can be used by other mini apps that connect to Stellar.

## Features

- Send and receive XLM
- View transaction history
- View account balance
- QR code support for receiving XLM

## Project Structure

This repository uses the following structure:
```text
.
├── packages
│   ├── bot
│   │   └── // Telegram bot implementation
│   ├── contracts
│   │   └── account
│   │       ├── src
│   │       │   ├── lib.rs
│   │       │   └── test.rs
│   │       └── Cargo.toml
│   └── webapp
│       └── // Next.js mini-app frontend
├── Cargo.toml
└── README.md
```

- The `packages/bot` directory contains the Telegram bot implementation
- The `packages/webapp` directory contains a Next.js project that serves as the mini-app frontend
- The `packages/contracts/account` contains a Soroban smart contract that manages user accounts tied to Telegram user IDs
- Contracts should have their own `Cargo.toml` files that rely on the top-level `Cargo.toml` workspace for their dependencies.

## Building the contracts

```cargo build