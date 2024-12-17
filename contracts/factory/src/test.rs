#![cfg(test)]

use soroban_sdk::{testutils::Env, Address, Bytes, symbol};

#[test]
fn test_create_account() {
    let env = Env::default();
    let factory_id = Address::random(&env);
    let telegram_id: i64 = 123456;
    let signature = Bytes::from_slice(&[1, 2, 3, 4, 5]);

    let result = env.invoke_contract(
        &factory_id,
        symbol!("create_account"),
        (telegram_id, signature.clone()),
    );

    match result {
        Ok(account_id) => assert!(account_id.is_valid()),
        Err(e) => panic!("Account creation failed: {}", e),
    }
}
