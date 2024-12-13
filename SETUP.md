# Setting up the development environment

This guide will help you set up the development environment for StarBeam.
Please note that this is a work in progress and the instructions may be incomplete.
Feel free to open an issue if you have any questions or suggestions.

## Common tools

Install Rust toolchain:

https://www.rust-lang.org/

## Stellar-related dependencies

1. Install wasm target for Rust

`rustup target add wasm32-unknown-unknown`

2. Install Stellar CLI

If you're on Mac, use `brew install stellar-cli`
On Linux, you can install with Cargo: `cargo install --locked stellar-cli@22.0.1 --features opt`

3. Initialize the environment

Run the `initialize.sh` script. It will create a deployer identity, build contracts, deploy contracts and generate typescript bindings.

`./initialize.sh`
