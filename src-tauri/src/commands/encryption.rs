use std::collections::HashMap;

use chacha20poly1305::{
    aead::{Aead, AeadCore, KeyInit, OsRng},
    XChaCha20Poly1305,
};

use crate::utils::utils::generate_random_bytes;

use super::hashing::derive_encryption_key;

#[tauri::command]
pub async fn encrypt_string(
    encryption_key: Vec<u8>,
    plaintext: String,
) -> Result<HashMap<String, String>, serde_json::Value> {
    tokio::task::spawn_blocking(move || {
        let salt = generate_random_bytes(16).map_err(|e| serde_json::json!({ "message": e }))?;

        let key = derive_encryption_key(encryption_key, salt.clone())
            .map_err(|e| serde_json::json!({ "message": e }))?;
        let key_array: [u8; 32] = key
            .try_into()
            .map_err(|_| serde_json::json!({ "message": "Invalid key length" }))?;
        let nonce = XChaCha20Poly1305::generate_nonce(OsRng);

        let encrypted_bytes = plaintext.as_bytes();

        let cipher = XChaCha20Poly1305::new(key_array.as_slice().into());

        let cipher_text = cipher
            .encrypt(&nonce, encrypted_bytes)
            .map_err(|_| serde_json::json!({ "message": "Failed to encrypt password" }))?;

        let mut map = HashMap::new();
        map.insert("encrypted".to_string(), hex::encode(cipher_text.clone()));
        map.insert("salt".to_string(), hex::encode(salt.clone()));
        map.insert("nonce".to_string(), hex::encode(nonce.clone()));

        Ok(map)
    })
    .await
    .map_err(|e| serde_json::json!({ "message": e.to_string() }))?
}

#[tauri::command]
pub async fn encrypt_string_with_key(
    encryption_key: Vec<u8>,
    plaintext: String,
) -> Result<HashMap<String, String>, serde_json::Value> {
    tokio::task::spawn_blocking(move || {
        if encryption_key.len() != 32 {
            return Err(serde_json::json!({ "message": "Key must be exactly 32 bytes" }));
        }

        let key_array: [u8; 32] = encryption_key
            .try_into()
            .map_err(|_| serde_json::json!({ "message": "Invalid key length" }))?;
        let nonce = XChaCha20Poly1305::generate_nonce(OsRng);

        let encrypted_bytes = plaintext.as_bytes();

        let cipher = XChaCha20Poly1305::new(key_array.as_slice().into());

        let cipher_text = cipher
            .encrypt(&nonce, encrypted_bytes)
            .map_err(|_| serde_json::json!({ "message": "Failed to encrypt password" }))?;

        let mut map = HashMap::new();
        map.insert("encrypted".to_string(), hex::encode(cipher_text.clone()));
        map.insert("nonce".to_string(), hex::encode(nonce.clone()));

        Ok(map)
    })
    .await
    .map_err(|e| serde_json::json!({ "message": e.to_string() }))?
}

#[tauri::command]
pub async fn decrypt_string(
    encryption_key: Vec<u8>,
    encrypted: String,
    salt: String,
    nonce: String,
) -> Result<String, serde_json::Value> {
    tokio::task::spawn_blocking(move || {
        let encrypted =
            hex::decode(encrypted).map_err(|e| serde_json::json!({ "message": e.to_string() }))?;
        let salt =
            hex::decode(salt).map_err(|e| serde_json::json!({ "message": e.to_string() }))?;

        let nonce =
            hex::decode(nonce).map_err(|e| serde_json::json!({ "message": e.to_string() }))?;
        let nonce_array: [u8; 24] = nonce
            .clone()
            .try_into()
            .map_err(|_| serde_json::json!({ "message": "Invalid nonce length" }))?;

        let key = derive_encryption_key(encryption_key, salt.clone())
            .map_err(|e| serde_json::json!({ "message": e }))?;
        let key_array: [u8; 32] = key
            .try_into()
            .map_err(|_| serde_json::json!({ "message": "Invalid key length" }))?;

        let cipher = XChaCha20Poly1305::new(key_array.as_slice().into());
        let plaintext = cipher
            .decrypt(nonce_array.as_slice().into(), encrypted.as_slice())
            .map_err(|_| serde_json::json!({ "message": "Failed to decrypt password" }))?;

        let decrypted = String::from_utf8(plaintext.to_vec())
            .map_err(|e| serde_json::json!({ "message": e.to_string() }))?;
        Ok(decrypted)
    })
    .await
    .map_err(|e| serde_json::json!({ "message": e.to_string() }))?
}

#[tauri::command]
pub async fn decrypt_string_with_key(
    encryption_key: Vec<u8>,
    encrypted: String,
    nonce: String,
) -> Result<String, serde_json::Value> {
    tokio::task::spawn_blocking(move || {
        if encryption_key.len() != 32 {
            return Err(serde_json::json!({ "message": "Key must be exactly 32 bytes" }));
        }

        let encrypted =
            hex::decode(encrypted).map_err(|e| serde_json::json!({ "message": e.to_string() }))?;
        let nonce =
            hex::decode(nonce).map_err(|e| serde_json::json!({ "message": e.to_string() }))?;
        let nonce_array: [u8; 24] = nonce
            .clone()
            .try_into()
            .map_err(|_| serde_json::json!({ "message": "Invalid nonce length" }))?;

        let key_array: [u8; 32] = encryption_key
            .try_into()
            .map_err(|_| serde_json::json!({ "message": "Invalid key length" }))?;

        let cipher = XChaCha20Poly1305::new(key_array.as_slice().into());
        let plaintext = cipher
            .decrypt(nonce_array.as_slice().into(), encrypted.as_slice())
            .map_err(|_| serde_json::json!({ "message": "Failed to decrypt password" }))?;

        let decrypted = String::from_utf8(plaintext.to_vec())
            .map_err(|e| serde_json::json!({ "message": e.to_string() }))?;
        Ok(decrypted)
    })
    .await
    .map_err(|e| serde_json::json!({ "message": e.to_string() }))?
}
