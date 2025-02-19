import type { Password } from "@/types";
import auth from "./auth.svelte";

import { getCurrentWindow } from "@tauri-apps/api/window";
import { load, Store } from "@tauri-apps/plugin-store";

class Preferences {
	public windowDecorations: "off" | "system" | "custom" = $state("system");
	public windowDecorationsSide: "left" | "right" = $state("right"); // only used when windowDecorations is set to custom

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

	/**
	 * Get saved server url
	 */
	public getServerUrl = async (): Promise<string | undefined> =>
		(await (await this._loadPreferences()).get("serverUrl")) as string;

	/**
	 * Set the server automatic validation, so that the user doesn't have to do it every time
	 */
	public setServerAutomaticValidation = async (
		value: boolean
	): Promise<void> =>
		await this._setValue("serverAutomaticValidation", value);

	/**
	 * Get saved server automatic validation
	 */
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

	/**
	 * Get saved user email
	 */
	public getUserEmail = async (): Promise<string | undefined> =>
		(await (await this._loadPreferences()).get("userEmail")) as string;

	/**
	 * Set window decorations. Default is system
	 */
	public setWindowDecorations = async (
		value: "off" | "system" | "custom"
	): Promise<void> => {
		await getCurrentWindow().setDecorations(
			value === "system" ? true : false
		);

		this.windowDecorations = value;
		await this._setValue("windowDecorations", value);
	};

	/**
	 * Get saved window decorations.
	 * This should be rewritten in rust, or we should use plugin `window state` https://v2.tauri.app/plugin/window-state/
	 * because we are loading it in +layout.svelte, which is delayed
	 */
	public getWindowDecorations = async (): Promise<
		"off" | "system" | "custom" | undefined
	> =>
		(await (await this._loadPreferences()).get("windowDecorations")) as
			| "off"
			| "system"
			| "custom";

	/**
	 * Set window decorations side. Only applies to `custom` type. Default is right
	 */
	public setWindowsDecorationsSide = async (
		side: "left" | "right"
	): Promise<void> => {
		await this._setValue("windowsDecorationsSide", side);
		this.windowDecorationsSide = side;
	};

	/**
	 * Get saved window decorations side. It shouldn't return `undefined`, but it's here just in case
	 */
	public getWindowsDecorationsSide = async (): Promise<
		"left" | "right" | undefined
	> =>
		(await (
			await this._loadPreferences()
		).get("windowsDecorationsSide")) as "left" | "right" | undefined;

	/**
	 * Set session length. Default is 30m. Only applies after the next login
	 */
	public setSessionLength = async (
		value: "5m" | "10m" | "30m" | "1h" | "2h"
	): Promise<void> => {
		await this._setValue("sessionLength", value);
		auth.sessionLength = value;
	};

	/**
	 * Get saved session length
	 */
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
