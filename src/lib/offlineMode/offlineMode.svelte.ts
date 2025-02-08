import passwords, { type Password } from "@/state/passwords.svelte";
import preferences from "@/state/preferences.svelte";

import { invoke } from "@tauri-apps/api/core";

interface OfflineModeData {
	salt: string;
	encryptionKey: Uint8Array;
}

/**
 * Save salt and encryption key to keyring.
 * Its gonna be used in offline mode to "login" without server connection, and decrypt passwords
 */
export const saveOfflineModeData = async (salt: string) => {
	await invoke("save_offline_mode_keys", {
		salt: salt,
		encryptionKey: passwords.encryptionKey,
	});
};

/**
 * Get salt and encryption key from keyring
 */
export const getOfflineModeData = async (): Promise<OfflineModeData> =>
	(await invoke("get_offline_mode_keys")) as OfflineModeData;

/**
 * Save !encrypted! passwords to json file (located in app data directory)
 */
export const saveOfflineModePasswords = async (
	passwords: Password[]
): Promise<void> => await preferences.saveOfflineModePasswords(passwords);

/**
 * Get last saved passwords
 */
export const getOfflineModePasswords = async (): Promise<Password[]> =>
	await preferences.getOfflineModePasswords();
