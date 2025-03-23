use argon2::Argon2;
use tokio::task;

#[tauri::command]
pub async fn get_encryption_key(password: String, salt: String) -> Result<Vec<u8>, String> {
    task::spawn_blocking(move || {
        let salt_bytes = hex::decode(&salt).map_err(|e| e.to_string())?;

        let mut output_key = [0u8; 32];
        Argon2::default()
            .hash_password_into(password.as_bytes(), salt_bytes.as_slice(), &mut output_key)
            .map_err(|e| e.to_string())?;

        Ok(output_key.to_vec())
    })
    .await
    .map_err(|e| e.to_string())?
}

pub fn derive_encryption_key(encryption_key: Vec<u8>, salt: Vec<u8>) -> Result<Vec<u8>, String> {
    let mut output_key = [0u8; 32];

    Argon2::default()
        .hash_password_into(encryption_key.as_slice(), salt.as_slice(), &mut output_key)
        .map_err(|e| e.to_string())?;

    Ok(output_key.to_vec())
}
