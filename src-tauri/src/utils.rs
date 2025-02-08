use argon2::Argon2;
use rand::{rngs::OsRng, TryRngCore};

pub fn derive_encryption_key(encryption_key: Vec<u8>, salt: Vec<u8>) -> Result<Vec<u8>, String> {
    let mut output_key = [0u8; 32];

    Argon2::default()
        .hash_password_into(encryption_key.as_slice(), salt.as_slice(), &mut output_key)
        .map_err(|e| e.to_string())?;

    Ok(output_key.to_vec())
}

pub fn generate_random_bytes(length: usize) -> Result<Vec<u8>, String> {
    let mut bytes = vec![0u8; length];

    OsRng
        .try_fill_bytes(&mut bytes)
        .map_err(|e| e.to_string())?;

    Ok(bytes)
}
