use chacha::{ChaCha, KeyStream};
use tokio::task;

use crate::utils;

#[tauri::command]
pub async fn encrypt_password(
    encryption_key: Vec<u8>,
    password: String,
) -> Result<std::collections::HashMap<String, String>, String> {
    task::spawn_blocking(move || {
        let salt = utils::generate_random_bytes(16)?;
        let nonce = utils::generate_random_bytes(24)?;
        let key = utils::derive_encryption_key(encryption_key, salt.clone())?;

        let key_bytes: [u8; 32] = key.try_into().map_err(|_| "Invalid key length")?;
        let nonce_bytes: [u8; 24] = nonce
            .clone()
            .try_into()
            .map_err(|_| "Invalid nonce length")?;

        let mut stream = ChaCha::new_xchacha20(&key_bytes, &nonce_bytes);

        let mut password_bytes = password.as_bytes().to_vec();
        println!("Password bytes before encryption: {:?}", password_bytes);

        stream
            .xor_read(&mut password_bytes)
            .map_err(|e| format!("{:?}", e))?;

        println!("Password bytes after encryption: {:?}", password_bytes);

        let mut map = std::collections::HashMap::new();
        map.insert("password".to_string(), hex::encode(password_bytes));
        map.insert("salt".to_string(), hex::encode(salt));
        map.insert("nonce".to_string(), hex::encode(nonce));

        Ok(map)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn decrypt_password(
    encryption_key: Vec<u8>,
    password: String,
    salt: String,
    nonce: String,
) -> Result<String, String> {
    task::spawn_blocking(move || {
        let enc_password = hex::decode(password).map_err(|e| e.to_string())?;
        let salt_bytes = hex::decode(salt).map_err(|e| e.to_string())?;
        let nonce_bytes = hex::decode(nonce).map_err(|e| e.to_string())?;

        let key = utils::derive_encryption_key(encryption_key, salt_bytes)?;

        let key_bytes: [u8; 32] = key.try_into().map_err(|_| "Invalid key length")?;
        let nonce_final: [u8; 24] = nonce_bytes.try_into().map_err(|_| "Invalid nonce length")?;

        let mut stream = ChaCha::new_xchacha20(&key_bytes, &nonce_final);
        let mut decrypted_bytes = enc_password.clone();

        stream
            .xor_read(&mut decrypted_bytes)
            .map_err(|e| format!("{:?}", e))?;

        let decrypted = String::from_utf8(decrypted_bytes).map_err(|e| e.to_string())?;

        Ok(decrypted)
    })
    .await
    .map_err(|e| e.to_string())?
}
