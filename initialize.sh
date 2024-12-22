#!/bin/bash

set -e

NETWORK="testnet"
RPC_URL="https://soroban-testnet.stellar.org"
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
CONTRACT_WASM="target/wasm32-unknown-unknown/release/account.wasm"
CONTRACT_ALIAS="account"
CONTRACT_ID_FILE=".soroban/account-id"

# Ensure necessary directories
mkdir -p .soroban
mkdir -p shared  # Add this line to create the shared directory

echo "Using $NETWORK network..."

# Add network configuration
echo $NETWORK > ./.soroban/network
echo $RPC_URL > ./.soroban/rpc-url
echo "$NETWORK_PASSPHRASE" > ./.soroban/passphrase
echo "{ \"network\": \"$NETWORK\", \"rpcUrl\": \"$RPC_URL\", \"networkPassphrase\": \"$NETWORK_PASSPHRASE\" }" > ./shared/config.json

# Check if deployer identity exists; create if not
if !(soroban keys ls | grep alice > /dev/null 2>&1); then
  echo "Creating deployer identity 'alice'..."
  soroban keys generate alice --network "$NETWORK" --rpc-url "$RPC_URL" --network-passphrase "$NETWORK_PASSPHRASE"
  soroban keys fund alice --network "$NETWORK"
else
  echo "Deployer identity 'alice' already exists."
fi

# Build contracts
echo "Building contracts..."
yarn build:contracts

# Deploy the contract
if [[ ! -f "$CONTRACT_ID_FILE" ]]; then
  echo "Deploying contract '$CONTRACT_ALIAS'..."
  soroban contract deploy \
    --wasm "$CONTRACT_WASM" \
    --source alice \
    --network "$NETWORK" \
    --rpc-url "$RPC_URL" \
    --network-passphrase "$NETWORK_PASSPHRASE" \
    --fee 1000000 > "$CONTRACT_ID_FILE"
  echo "Contract deployed successfully with ID: $(cat "$CONTRACT_ID_FILE")"
else
  echo "Contract already deployed. Skipping deployment."
fi

# Generate TypeScript bindings
echo "Generating TypeScript bindings..."
yarn bindings

echo "Initialization complete."