// #![no_std]
// use soroban_sdk::{contract, contractimpl, vec, Env, String, Vec};

// #[contract]
// pub struct Contract;

// #[contractimpl]
// impl Contract {
//     pub fn hello(env: Env, to: String) -> Vec<String> {
//         vec![&env, String::from_str(&env, "Hello"), to]
//     }
// }

// mod test;
#![no_std]

use soroban_sdk::{contractimpl, symbol, Address, Env, Bytes, IntoVal, TryFromVal};

pub struct AccountContract;

#[contractimpl]
impl AccountContract {
    // Store Telegram User ID in contract storage
    pub fn initialize(env: Env, telegram_user_id: i64) {
        env.storage().set(&symbol!("telegram_user_id"), &telegram_user_id);
    }

    // Verify signature and perform an action (e.g., transfer XLM)
    pub fn verify_and_transfer(
        env: Env,
        from: Address,
        to: Address,
        amount: i64,
        telegram_signature: Vec<u8>,
    ) -> Result<(), &'static str> {
        let stored_id: i64 = env.storage().get(&symbol!("telegram_user_id")).unwrap();

        // Implement real signature verification logic here
        if telegram_signature.len() as i64 == stored_id {
            // Perform transfer (mock logic for now)
            env.events().publish((from.clone(), to.clone()), amount);
            Ok(())
        } else {
            Err("Invalid signature!")
        }
    }
}
