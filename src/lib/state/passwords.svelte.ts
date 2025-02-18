import auth from "./auth.svelte";
import preferences from "./preferences.svelte";

import { getErrorMessage, makeRequest } from "@/utils";
import { invoke } from "@tauri-apps/api/core";
import { getOfflineModePasswords } from "@/offlineMode/offlineMode.svelte";
import type { Password } from "@/types";

class PasswordsState {
	public encryptionKey: Uint8Array = $state(new Uint8Array(0));
	public passwords: Password[] = $state([]);

	public selectedPassword: Password | null = $state(null);
	public isEditing: boolean = $state(false); // should be disabled in offline mode

	/**
	 * Get passwords from server or offline mode. Automatically selects first password
	 *
	 * @param selectPasswordInTrash If true, first password in trash will be selected
	 */
	public getPasswords = async (
		selectPasswordInTrash: boolean = false
	): Promise<void> => {
		this.isEditing = false;
		this.passwords = [];
		this.selectedPassword = null;

		if (auth.isOfflineMode) {
			this.passwords = await getOfflineModePasswords();
		} else {
			const res = await makeRequest("/passwords", "GET", {
				authorization: true,
			});

			this.passwords = await res.json();
		}

		if (this.passwords.length) {
			const passwordToSelect = this.passwords.find(
				(p) => p.inTrash === selectPasswordInTrash
			);
			if (passwordToSelect) {
				await this.setSelectedPassword(passwordToSelect);
			}
		} else {
			this.selectedPassword = null;
		}

		await preferences.saveOfflineModePasswords(this.passwords);
	};

	/**
	 * `password` parameter MUST be decrypted. This function will create a new password instance and decrypt it
	 */
	public setSelectedPassword = async (password: Password) => {
		if (this.selectedPassword?.id === password.id) return;

		this.isEditing = false;
		this.selectedPassword = null;
		this.selectedPassword = {
			...password,
			username: { ...password.username },
			password: { ...password.password },
			note: { ...password.note },
			websites: [...password.websites],
			tags: [...password.tags],
		};

		this.selectedPassword = await this.decryptPassword(
			this.selectedPassword
		);
	};

	/**
	 * Update selected password. !!! Only decrypted password should be passed to this function !!!
	 */
	public updatePassword = async (password: Password): Promise<void> => {
		this.isEditing = false;

		password = await this.encryptPassword(password);

		await makeRequest(`/passwords/${password.id}`, "PATCH", {
			authorization: true,
			body: JSON.stringify({
				title: password.title,
				username: password.username.value ? password.username : null,
				password: password.password.value ? password.password : null,
				note: password.note.value ? password.note : null,
				websites: password.websites,
				tags: password.tags,
				inTrash: password.inTrash,
			}),
		});

		await this.getPasswords();
	};

	/**
	 * Move password to trash. !!! Only decrypted password should be passed to this function !!!
	 */
	public movePasswordToTrash = async (password: Password): Promise<void> => {
		if (password.inTrash) {
			throw new Error("Password is already in trash");
		}

		password.inTrash = true;
		await this.updatePassword(password);
	};

	/**
	 * Remove password from trash (restore). !!! Only decrypted password should be passed to this function !!!
	 */
	public restorePassword = async (password: Password): Promise<void> => {
		if (!password.inTrash) {
			throw new Error("Password is not in trash");
		}

		password.inTrash = false;
		await this.updatePassword(password);
	};

	/**
	 * Permanently delete password
	 */
	public deletePassword = async (password: Password): Promise<void> => {
		await makeRequest(`/passwords/${password.id}`, "DELETE", {
			authorization: true,
		});

		await this.getPasswords(true);
	};

	public addNewPassword = async (password: Password): Promise<void> => {
		await makeRequest("/passwords", "POST", {
			authorization: true,
			body: JSON.stringify({
				title: password.title,
				inTrash: false,
				username: password.username.value.length
					? password.username
					: null,
				password: password.password.value.length
					? password.password
					: null,
				note: password.note.value.length ? password.note : null,
				websites: password.websites,
				tags: password.tags,
			}),
		});

		await this.getPasswords();
	};

	public encryptPassword = async (password: Password): Promise<Password> => {
		if (password.username.value) {
			const { encrypted, salt, nonce } = await invoke<{
				encrypted: string;
				salt: string;
				nonce: string;
			}>("encrypt_string", {
				encryptionKey: this.encryptionKey,
				plaintext: password.username.value,
			});

			password.username.value = encrypted;
			password.username.salt = salt;
			password.username.nonce = nonce;
		}

		if (password.password.value) {
			const { encrypted, salt, nonce } = await invoke<{
				encrypted: string;
				salt: string;
				nonce: string;
			}>("encrypt_string", {
				encryptionKey: this.encryptionKey,
				plaintext: password.password.value,
			});

			password.password.value = encrypted;
			password.password.salt = salt;
			password.password.nonce = nonce;
		}

		if (password.note.value) {
			const { encrypted, salt, nonce } = await invoke<{
				encrypted: string;
				salt: string;
				nonce: string;
			}>("encrypt_string", {
				encryptionKey: this.encryptionKey,
				plaintext: password.note.value,
			});

			password.note.value = encrypted;
			password.note.salt = salt;
			password.note.nonce = nonce;
		}

		return password;
	};

	public decryptPassword = async (password: Password): Promise<Password> => {
		if (password.username.value) {
			password.username.value = await invoke<string>("decrypt_string", {
				encryptionKey: this.encryptionKey,
				encrypted: password.username.value,
				salt: password.username.salt,
				nonce: password.username.nonce,
			});
		}

		if (password.password.value) {
			password.password.value = await invoke<string>("decrypt_string", {
				encryptionKey: this.encryptionKey,
				encrypted: password.password.value,
				salt: password.password.salt,
				nonce: password.password.nonce,
			});
		}

		if (password.note.value) {
			password.note.value = await invoke<string>("decrypt_string", {
				encryptionKey: this.encryptionKey,
				encrypted: password.note.value,
				salt: password.note.salt,
				nonce: password.note.nonce,
			});
		}

		return password;
	};
}

const passwords = new PasswordsState();
export default passwords;
