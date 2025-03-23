pub mod commands;
pub mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            commands::hashing::get_encryption_key,
            commands::encryption::encrypt_string,
            commands::encryption::decrypt_string,
            commands::encryption::encrypt_string_with_key,
            commands::encryption::decrypt_string_with_key,
            commands::srp::generate_salt,
            commands::srp::generate_verifier,
            commands::srp::generate_srp_credentials,
            commands::srp::calculate_srp_proof,
            commands::offline_mode::save_offline_mode_encryption_key,
            commands::offline_mode::get_offline_mode_encryption_key,
        ])
        .setup(|app| {
            #[cfg(desktop)]
            let _ = app
                .handle()
                .plugin(tauri_plugin_updater::Builder::new().build());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
