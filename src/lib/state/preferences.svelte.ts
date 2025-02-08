import auth from "./auth.svelte";

import { getCurrentWindow } from "@tauri-apps/api/window";
import { load, Store } from "@tauri-apps/plugin-store";
import type { Password } from "./passwords.svelte";

class Preferences {
	public windowDecorations: "off" | "system" | "custom" = $state("system");

	private _loadPreferences = async (): Promise<Store> =>
		await load("preferences.json", { autoSave: false });

	private _setValue = async (key: string, value: any): Promise<void> => {
		const store = await this._loadPreferences();

		await store.set(key, value);
		await store.save();
	};

	/**
	 * Set the server URL, so that the user doesn't have to type it in every time
	 */
	public setServerUrl = async (value: string): Promise<void> =>
		await this._setValue("serverUrl", value);

	public getServerUrl = async (): Promise<string | undefined> =>
		(await (await this._loadPreferences()).get("serverUrl")) as string;

	public setServerAutomaticValidation = async (
		value: boolean
	): Promise<void> =>
		await this._setValue("serverAutomaticValidation", value);

	public getServerAutomaticValidation = async (): Promise<
		boolean | undefined
	> =>
		(await (
			await this._loadPreferences()
		).get("serverAutomaticValidation")) as boolean;

	/**
	 * Set the user email, so that the user doesn't have to type it in every time
	 */
	public setUserEmail = async (value: string): Promise<void> =>
		await this._setValue("userEmail", value);

	public getUserEmail = async (): Promise<string | undefined> =>
		(await (await this._loadPreferences()).get("userEmail")) as string;

	public setWindowDecorations = async (
		value: "off" | "system" | "custom"
	): Promise<void> => {
		await getCurrentWindow().setDecorations(
			value === "system" ? true : false
		);

		this.windowDecorations = value;
		await this._setValue("windowDecorations", value);
	};

	public getWindowDecorations = async (): Promise<
		"off" | "system" | "custom" | undefined
	> =>
		(await (await this._loadPreferences()).get("windowDecorations")) as
			| "off"
			| "system"
			| "custom";

	public setSessionLength = async (
		value: "5m" | "10m" | "30m" | "1h" | "2h"
	): Promise<void> => {
		await this._setValue("sessionLength", value);
		auth.sessionLength = value;
	};

	public getSessionLength = async (): Promise<
		"5m" | "10m" | "30m" | "1h" | "2h"
	> =>
		((await (await this._loadPreferences()).get("sessionLength")) as
			| "5m"
			| "10m"
			| "30m"
			| "1h"
			| "2h") || "30m";

	/**
	 * This is not really preferences, but it saves the passwords to use them in offline mode
	 */
	public saveOfflineModePasswords = async (
		passwords: Password[]
	): Promise<void> => await this._setValue("offlineModePasswords", passwords);

	public getOfflineModePasswords = async (): Promise<Password[]> =>
		(await (await this._loadPreferences()).get("offlineModePasswords")) ||
		[];

	public deleteOfflineModePasswords = async () => {};
}

const preferences = new Preferences();
export default preferences;
