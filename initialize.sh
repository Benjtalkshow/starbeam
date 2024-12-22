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
mkdir -p shared

echo "Using $NETWORK network..."

# Function to write config and check for errors
write_config() {
    echo "$2" > "$1" || { echo "Error writing to $1"; exit 1; }
    [[ -s "$1" ]] || { echo "Failed to write to $1"; exit 1; }
}

# Add network configuration with validation
write_config "./.soroban/network" "$NETWORK"
write_config "./.soroban/rpc-url" "$RPC_URL"
write_config "./.soroban/passphrase" "$NETWORK_PASSPHRASE"

# Write JSON config
CONFIG_JSON=$(cat <<EOF
{
  "network": "$NETWORK",
  "rpcUrl": "$RPC_URL",
  "networkPassphrase": "$NETWORK_PASSPHRASE"
}
EOF
)
write_config "./shared/config.json" "$CONFIG_JSON"

# Check if deployer identity exists; create if not
if ! soroban keys ls | grep -q alice; then
  echo "Creating deployer identity 'alice'..."
  soroban keys generate alice --network "$NETWORK" --rpc-url "$RPC_URL" --network-passphrase "$NETWORK_PASSPHRASE"
  soroban keys fund alice --network "$NETWORK"
else
  echo "Deployer identity 'alice' already exists."
fi

# Build contracts
echo "Building contracts..."
if ! yarn build:contracts; then
  echo "Failed to build contracts"
  exit 1
fi

# Check for WASM file
if [ ! -f "$CONTRACT_WASM" ]; then
  echo "Contract WASM not found. Build may have failed."
  exit 1
fi

# Deploy the contract
if [[ ! -f "$CONTRACT_ID_FILE" ]]; then
  echo "Deploying contract '$CONTRACT_ALIAS'..."
  if ! soroban contract deploy \
    --wasm "$CONTRACT_WASM" \
    --source alice \
    --network "$NETWORK" \
    --rpc-url "$RPC_URL" \
    --network-passphrase "$NETWORK_PASSPHRASE" \
    --fee 1000000 > "$CONTRACT_ID_FILE"
  then
    echo "Failed to deploy contract"
    exit 1
  fi
  echo "Contract deployed successfully with ID: $(cat "$CONTRACT_ID_FILE")"
else
  echo "Contract already deployed. Skipping deployment."
fi

# Check for contract ID file
if [ ! -f "$CONTRACT_ID_FILE" ]; then
  echo "Contract ID file not found. Deployment may have failed."
  exit 1
fi

# Generate TypeScript bindings
echo "Generating TypeScript bindings..."
if ! yarn bindings; then
  echo "Failed to generate TypeScript bindings"
  exit 1
fi

echo "Initialization complete."