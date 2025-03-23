use num_bigint::BigUint;
use num_traits::Num;
use rand::{rngs::OsRng, TryRngCore};

pub fn hex_to_biguint(hex: &str) -> BigUint {
    BigUint::from_str_radix(hex, 16).unwrap()
}

pub fn generate_random_bytes(length: usize) -> Result<Vec<u8>, String> {
    let mut bytes = vec![0u8; length];

    OsRng
        .try_fill_bytes(&mut bytes)
        .map_err(|e| e.to_string())?;

    Ok(bytes)
}
