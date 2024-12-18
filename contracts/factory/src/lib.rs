#![no_std]
use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, Map, Symbol};

// import account contract
mod account_contract {
    soroban_sdk::contractimport!(file = "../../target/wasm32-unknown-unknown/release/account.wasm");
}

#[contract]
pub struct Factory;

#[contractimpl]
impl Factory {
    // Deploy an account contract for a Telegram user
    pub fn deploy_account(env: Env, telegram_uid: BytesN<32>, signature: BytesN<64>) -> Address {
        // Verify ownership
        if !verify_signature(&env, &telegram_uid, &signature) {
            panic!("Invalid signature: Ownership verification failed");
        }

        // Check if an account already exists for the UID
        let existing_account: Option<Address> = Factory::get_account(&env, telegram_uid.clone());
        if existing_account.is_some() {
            panic!("Account already exists for this Telegram UID");
        }

        let account_wasm_hash = env.deployer().upload_contract_wasm(account_contract::WASM);
        let salt = BytesN::from_array(&env, &[0; 32]);

        // Deploy a new account contract
        let account_contract_address = deploy_account_contract(
            &env,
            env.current_contract_address(),
            account_wasm_hash,
            salt,
        );

        // map Telegram UID to the account contract address
        let mut uid_to_account: Map<BytesN<32>, Address> = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, "uid_to_account"))
            .unwrap_or_else(|| Map::new(&env));
        uid_to_account.set(telegram_uid.clone(), account_contract_address.clone());
        env.storage()
            .persistent()
            .set(&Symbol::new(&env, "uid_to_account"), &uid_to_account);

        // return deployed account contract address
        account_contract_address
    }

    // lookup account contract by Telegram UID
    pub fn get_account(env: &Env, telegram_uid: BytesN<32>) -> Option<Address> {
        let uid_to_account: Option<Map<BytesN<32>, Address>> = env
            .storage()
            .persistent()
            .get(&Symbol::new(&env, "uid_to_account"));
        uid_to_account.and_then(|map| map.get(telegram_uid))
    }
}

// deploy an account contract
fn deploy_account_contract(
    env: &Env,
    deployer: Address,
    wasm_hash: BytesN<32>,
    salt: BytesN<32>,
) -> Address {
    if deployer != env.current_contract_address() {
        deployer.require_auth();
    }

    let deployed_address = env
        .deployer()
        .with_address(deployer, salt)
        .deploy(wasm_hash);

    deployed_address
}

//TODO
fn verify_signature(env: &Env, telegram_uid: &BytesN<32>, signature: &BytesN<64>) -> bool {
    // using first byte of the signature and UID to simulate valid/invalid cases
    signature.get(0) == telegram_uid.get(0)
}

mod test;
