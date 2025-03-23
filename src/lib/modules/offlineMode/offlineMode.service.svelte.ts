import type { OfflineModeData } from "./offlineMode.types.svelte";
import type { Password } from "../passwords/passwords.types.svelte";
import { invoke } from "@tauri-apps/api/core";
import { storageService } from "../storage/storage.service.svelte";

class OfflineModeService {
    public getData = async (): Promise<OfflineModeData> =>
        await invoke<OfflineModeData>("get_offline_mode_encryption_key");

    public getPasswords = async (): Promise<Password[]> =>
        await storageService.getOfflineModePasswords();

    public saveData = async (
        email: string,
        encryptionKey: Uint8Array,
        salt: string,
        passwords: Password[],
    ): Promise<void> => {
        await invoke<void>("save_offline_mode_encryption_key", {
            email,
            encryptionKey,
            salt,
        });

        await storageService.saveOfflineModePasswords(passwords);
    };
}

export const offlineModeService = new OfflineModeService();
