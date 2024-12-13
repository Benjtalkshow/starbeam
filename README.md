# StarBeam

StarBeam is a smart Stellar wallet being developed as a Telegram mini app (currently in early stages of development).
The goal is to create a wallet that will be tied to your Telegram account, allowing token transfers between Telegram users and regular Stellar wallets.
Once completed, it will also serve as a foundation for other Stellar-based mini apps.

## Upcoming Features

- Send and receive XLM
- View transaction history
- View account balance
- Ability to serve as a base layer for other mini-apps

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

## Setting up building environment

See [SETUP](./SETUP.md) for more details

## Initializing the environment (create deployer identity, build contracts, deploy contracts and generate typescript bindings)

`./initialize.sh`

## Building the contracts

`stellar contract build`

## Testing contracts

`cargo test`

## Optimizing contracts

`stellar contract optimize --wasm target/wasm32-unknown-unknown/release/account.wasm`

## Deploying contracts to testnet

Note: Use your own account name instead of `alice`

```sh
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/account.wasm \
  --source alice \
  --network futurenet \
  --alias account
```

## Generating Typescript bindings

Note: This is automatically run when you run `yarn install`, but you can also run it manually with:

```sh
yarn bindings
```
