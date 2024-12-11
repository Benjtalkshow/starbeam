## Common tools

Install Rust toolchain:

https://www.rust-lang.org/

## Stellar-related dependencies

1. Install wasm target for Rust

`rustup target add wasm32-unknown-unknown`

2. Install Stellar CLI

If you're on Mac, use `brew install stellar-cli`
On Linux, you can install with Cargo: `cargo install --locked stellar-cli@22.0.1 --features opt`

3. Generate account on testnet:
`stellar keys generate --global alice --network testnet --fund`

4. Get the address of a new account
`stellar keys address alice`