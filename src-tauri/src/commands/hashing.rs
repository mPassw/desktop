use argon2::{password_hash::SaltString, Argon2};
use tokio::task;

#[tauri::command]
pub async fn argon2_hash(password: String, salt: String) -> Result<Vec<u8>, String> {
    task::spawn_blocking(move || {
        let salt_bytes = hex::decode(&salt).map_err(|e| e.to_string())?;

        let salt_string = SaltString::encode_b64(&salt_bytes).map_err(|e| e.to_string())?;

        let mut output_key = [0u8; 32];
        Argon2::default()
            .hash_password_into(
                password.as_bytes(),
                salt_string.as_str().as_bytes(),
                &mut output_key,
            )
            .map_err(|e| e.to_string())?;

        Ok(output_key.to_vec())
    })
    .await
    .map_err(|e| e.to_string())?
}
