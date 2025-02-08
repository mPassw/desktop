use keyring::Entry;
use serde::Serialize;
use serde_json::{json, Value};

#[derive(Serialize)]
pub struct OfflineModeKeys {
    salt: String,
    #[serde(rename = "encryptionKey")]
    encryption_key: Vec<u8>,
}

const SERVICE_NAME: &str = "mPass Offline Mode";

#[tauri::command]
pub fn save_offline_mode_keys(salt: String, encryption_key: Vec<u8>) -> Result<(), String> {
    let entry =
        Entry::new(SERVICE_NAME, &tauri_plugin_os::hostname()).map_err(|e| e.to_string())?;

    let keys_json = json!({
        "salt": salt,
        "encryption_key": hex::encode(encryption_key)
    });

    entry
        .set_password(&keys_json.to_string())
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn get_offline_mode_keys() -> Result<OfflineModeKeys, String> {
    let entry =
        Entry::new(SERVICE_NAME, &tauri_plugin_os::hostname()).map_err(|e| e.to_string())?;

    let password = entry.get_password().map_err(|e| e.to_string())?;
    let json_value: Value = serde_json::from_str(&password).map_err(|e| e.to_string())?;

    if let Value::Object(map) = json_value {
        let salt = map
            .get("salt")
            .and_then(|v| v.as_str())
            .ok_or("Missing salt")?
            .to_string();

        let encryption_key = map
            .get("encryption_key")
            .and_then(|v| v.as_str())
            .ok_or("Missing encryption_key")?;

        let decoded_key = hex::decode(encryption_key).map_err(|e| e.to_string())?;

        return Ok(OfflineModeKeys {
            salt,
            encryption_key: decoded_key,
        });
    }

    Err("Invalid JSON structure".to_string())
}
