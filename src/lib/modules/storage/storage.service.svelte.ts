import type { HistoryItem } from "../generator/generator.types.svelte";
import { load, type Store } from "@tauri-apps/plugin-store";
import type { Password } from "../passwords/passwords.types.svelte";

class StorageService {
    public getLastServerUrl = async (): Promise<string | null> =>
        await this._getValue("lastServerUrl");

    public setLastServerUrl = async (url: string): Promise<void> =>
        await this._setValue("lastServerUrl", url);

    public getLastEmail = async (): Promise<string | null> =>
        await this._getValue("lastEmail");

    public setLastEmail = async (email: string): Promise<void> =>
        await this._setValue("lastEmail", email);

    public getAnimations = async (): Promise<"enable" | "disable"> => {
        const value = await this._getValue("preferencesAnimations");
        return (value as "enable" | "disable") ?? "enable";
    };

    public setAnimations = async (value: "enable" | "disable"): Promise<void> =>
        await this._setValue("preferencesAnimations", value);

    public getSessionDuration = async (): Promise<
        "5m" | "10m" | "30m" | "1h" | "2h"
    > => {
        const value = await this._getValue("preferencesSessionDuration");
        return (value as "5m" | "10m" | "30m" | "1h" | "2h") ?? "30m";
    };

    public setSessionDuration = async (
        value: "5m" | "10m" | "30m" | "1h" | "2h",
    ): Promise<void> =>
        await this._setValue("preferencesSessionDuration", value);

    public getIcons = async (): Promise<"enable" | "disable"> => {
        const value = await this._getValue("preferencesIcons");
        return (value as "enable" | "disable") ?? "enable";
    };

    public setIcons = async (value: "enable" | "disable"): Promise<void> =>
        await this._setValue("preferencesIcons", value);

    public getGeneratorHistory = async (): Promise<HistoryItem[]> => {
        const history = await this._getValue("generatorHistory");
        if (history === null) return [];
        return JSON.parse(history) as HistoryItem[];
    };

    public addItemToGeneratorHistory = async (
        item: HistoryItem,
    ): Promise<HistoryItem[]> => {
        const history = await this.getGeneratorHistory();
        history.unshift(item);
        if (history.length > 50) {
            history.length = 50;
        }
        await this._setValue("generatorHistory", JSON.stringify(history));
        return history;
    };

    public clearGeneratorHistory = async (): Promise<void> =>
        await this._setValue("generatorHistory", "[]");

    public saveOfflineModePasswords = async (
        passwords: Password[],
    ): Promise<void> =>
        await this._setValue("offlineModePasswords", JSON.stringify(passwords));

    public getOfflineModePasswords = async (): Promise<Password[]> => {
        const passwords = await this._getValue("offlineModePasswords");

        return passwords === null ? [] : (JSON.parse(passwords) as Password[]);
    };

    private _getStore = async (): Promise<Store> =>
        await load("storage.json", { autoSave: false });

    private _getValue = async (key: string): Promise<string | null> =>
        (await (await this._getStore()).get(key)) ?? null;

    private _setValue = async (key: string, value: string): Promise<void> => {
        const store = await this._getStore();

        await store.set(key, value);
        await store.save();
    };
}

export const storageService = new StorageService();
