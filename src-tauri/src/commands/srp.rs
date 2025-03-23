use num_bigint::BigUint;
use serde::{Deserialize, Serialize};

use crate::utils::{
    srp_group::N_HEX,
    srp_utils::{calculate_client_evidence, calculate_secret, calculate_x, DigestWrapper},
    utils::{generate_random_bytes, hex_to_biguint},
};

#[derive(Serialize, Deserialize)]
pub struct SrpCredentials {
    private_key: String,
    public_key: String,
}

#[tauri::command]
pub fn generate_salt() -> Result<String, String> {
    let salt = generate_random_bytes(16).map_err(|e| e.to_string())?;

    Ok(hex::encode(salt))
}

#[tauri::command]
pub fn generate_verifier(email: String, password: String, salt: String) -> Result<String, String> {
    let n = hex_to_biguint(N_HEX);
    let g = BigUint::from(2u8);

    let mut digest = DigestWrapper::new();
    let x = calculate_x(
        &mut digest,
        &n,
        &hex::decode(salt).map_err(|e| e.to_string())?,
        email.as_bytes(),
        password.as_bytes(),
    );

    let v = g.modpow(&x, &n);

    Ok(v.to_str_radix(16))
}

#[tauri::command]
pub fn generate_srp_credentials() -> Result<SrpCredentials, String> {
    let n = hex_to_biguint(N_HEX);
    let g = BigUint::from(2u8);

    let random_bytes = generate_random_bytes(32).map_err(|e| e.to_string())?;
    let mut a = BigUint::from_bytes_be(&random_bytes);

    a = a % &n;

    if a == BigUint::from(0u8) {
        a = BigUint::from(1u8);
    }

    let a_pub = g.modpow(&a, &n);

    Ok(SrpCredentials {
        private_key: a.to_str_radix(16),
        public_key: a_pub.to_str_radix(16),
    })
}

#[tauri::command]
pub fn calculate_srp_proof(
    private_key: String,
    email: String,
    password: String,
    salt: String,
    server_b: String,
) -> Result<String, String> {
    let n = hex_to_biguint(N_HEX);
    let g = BigUint::from(2u8);

    let priv_a =
        BigUint::parse_bytes(private_key.as_bytes(), 16).ok_or("Invalid private key format")?;

    let mut digest = DigestWrapper::new();
    let x = calculate_x(
        &mut digest,
        &n,
        &hex::decode(salt).map_err(|e| e.to_string())?,
        email.as_bytes(),
        password.as_bytes(),
    );

    let pub_a = g.modpow(&priv_a, &n);

    let secret = calculate_secret(&priv_a, &pub_a, &server_b, &x)?;

    calculate_client_evidence(&pub_a, &server_b, &secret)
}
