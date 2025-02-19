mod commands;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::hashing::argon2_hash,
            commands::encryption::encrypt_string,
            commands::encryption::decrypt_string,
            commands::offline_mode::save_offline_mode_keys,
            commands::offline_mode::get_offline_mode_keys
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
