import {
    isPermissionGranted,
    requestPermission,
} from "@tauri-apps/plugin-notification";
import { storageService } from "../storage/storage.service.svelte";
import { preferencesState } from "./preferences.state.svelte";

class PreferencesService {
    public getPreferences = async () => {
        preferencesState.enableAnimations =
            await storageService.getAnimations();
        preferencesState.enableIcons = await storageService.getIcons();
        preferencesState.sessionDuration =
            await storageService.getSessionDuration();

        if (preferencesState.notificationsPermissionsGranted === "default") {
            const permission = await requestPermission();
            preferencesState.notificationsPermissionsGranted = permission;
        }
    };

    public enableAnimations = async () => {
        await storageService.setAnimations("enable");
        preferencesState.enableAnimations = "enable";
    };

    public disableAnimations = async () => {
        await storageService.setAnimations("disable");
        preferencesState.enableAnimations = "disable";
    };

    public enableIcons = async () => {
        await storageService.setIcons("enable");
        preferencesState.enableIcons = "enable";
    };

    public disableIcons = async () => {
        await storageService.setIcons("disable");
        preferencesState.enableIcons = "disable";
    };

    public setSessionDuration = async (
        value: "5m" | "10m" | "30m" | "1h" | "2h",
    ) => {
        await storageService.setSessionDuration(value);
        preferencesState.sessionDuration = value;
    };
}

export const preferencesService = new PreferencesService();
