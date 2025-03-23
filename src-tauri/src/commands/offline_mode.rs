use chrono::Utc;
use std::collections::HashMap;

use keyring::Entry;
use serde_json::{json, Value};

const SERVICE_NAME: &str = "mPass offline mode";

#[tauri::command]
pub fn save_offline_mode_encryption_key(
    email: String,
    encryption_key: Vec<u8>,
    salt: String,
) -> Result<(), String> {
    let entry =
        Entry::new(SERVICE_NAME, &tauri_plugin_os::hostname()).map_err(|e| e.to_string())?;

    let current_date = Utc::now();

    let keys_json = json!({
        "email": email,
        "encryption_key": hex::encode(encryption_key),
        "salt": salt,
        "created_at": current_date.to_rfc3339(),
    });

    entry
        .set_password(&keys_json.to_string())
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn get_offline_mode_encryption_key() -> Result<HashMap<String, serde_json::Value>, String> {
    let entry =
        Entry::new(SERVICE_NAME, &tauri_plugin_os::hostname()).map_err(|e| e.to_string())?;

    let password = entry.get_password().map_err(|e| e.to_string())?;

    if password.is_empty() {
        return Err("No offline mode data found".to_string());
    }

    let json_value: Value = serde_json::from_str(&password).map_err(|e| e.to_string())?;

    if let Value::Object(map) = json_value {
        let email = map
            .get("email")
            .and_then(|v| v.as_str())
            .ok_or("Missing email")?
            .to_string();

        let salt = map
            .get("salt")
            .and_then(|v| v.as_str())
            .ok_or("Missing salt")?
            .to_string();

        let encryption_key = map
            .get("encryption_key")
            .and_then(|v| v.as_str())
            .ok_or("Missing encryption_key")?;

        let created_at = map
            .get("created_at")
            .and_then(|v| v.as_str())
            .unwrap_or("unknown")
            .to_string();

        let decoded_key = hex::decode(encryption_key).map_err(|e| e.to_string())?;

        let mut result = HashMap::new();
        result.insert("email".to_string(), Value::String(email));
        result.insert("salt".to_string(), Value::String(salt));
        result.insert(
            "encryptionKey".to_string(),
            Value::Array(
                decoded_key
                    .iter()
                    .map(|&b| Value::Number(b.into()))
                    .collect(),
            ),
        );
        result.insert("createdAt".to_string(), Value::String(created_at));

        Ok(result)
    } else {
        Err("Invalid JSON structure".to_string())
    }
}
