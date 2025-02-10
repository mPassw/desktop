import server from "./server.svelte";
import auth from "./auth.svelte";

import { fetch } from "@tauri-apps/plugin-http";
import { getErrorMessage } from "@/utils";
import { invoke } from "@tauri-apps/api/core";
import { getOfflineModePasswords } from "@/offlineMode/offlineMode.svelte";
import { toast } from "svelte-sonner";

interface EncryptedField {
	value: string;
	salt: string;
	nonce: string;
}

export interface Password {
	id: number;

	inTrash: boolean;
	title: string;

	username: EncryptedField;
	password: EncryptedField;
	note: EncryptedField;

	websites: string[];
	tags: string[];

	createdAt: string;
	updatedAt: string;
}

class PasswordsState {
	public encryptionKey: Uint8Array = $state(new Uint8Array(0));
	public passwords: Password[] = $state([]);

	public selectedPassword: Password | null = $state(null);
	public isEditing: boolean = $state(false); // should be disabled in offline mode

	public getPasswords = async (): Promise<void> => {
		this.isEditing = false;
		this.passwords = [];
		this.selectedPassword = null;

		if (auth.isOfflineMode) {
			this.passwords = await getOfflineModePasswords();
		} else {
			const res = await fetch(server.serverUrl + "/passwords", {
				method: "GET",
				headers: {
					Authorization: "Bearer " + auth.authToken,
				},
			});

			if (!res.ok) {
				throw new Error(getErrorMessage(await res.json()));
			}

			this.passwords = await res.json();
		}

		if (this.passwords.length) {
			await this.setSelectedPassword(this.passwords[0]);
		} else {
			this.selectedPassword = null;
		}
	};

	/**
	 * `password` parameter MUST be decrypted. This function will create a new password instance and encrypt the fields
	 */
	public setSelectedPassword = async (password: Password) => {
		if (this.selectedPassword?.id === password.id) return;

		this.selectedPassword = {
			...password,
			username: { ...password.username },
			password: { ...password.password },
			note: { ...password.note },
			websites: { ...password.websites },
			tags: { ...password.tags },
		};

		this.selectedPassword = await this.decryptPassword(
			this.selectedPassword
		);
	};

	public encryptPassword = async () => {
		try {
			const encryptedData = await invoke<{
				encrypted: string;
				salt: string;
				nonce: string;
			}>("encrypt_string", {
				encryptionKey: passwords.encryptionKey,
				password: "oiblyat234!",
			});

			console.log(encryptedData.encrypted.length);

			const res = await fetch(server.serverUrl + "/passwords/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${auth.authToken}`,
				},
				body: JSON.stringify({
					title: "Test",
					password: {
						value: encryptedData.encrypted,
						salt: encryptedData.salt,
						nonce: encryptedData.nonce,
					},
					websites: [],
					note: null,
					tags: [],
				}),
			});

			if (res.status !== 201) {
				console.error(await res.json());
			}

			await this.getPasswords();
		} catch (err: any) {
			toast.error(err);
		}
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

		console.log("Decrypted username: ", password.username.value);

		if (password.password.value) {
			password.password.value = await invoke<string>("decrypt_string", {
				encryptionKey: this.encryptionKey,
				encrypted: password.password.value,
				salt: password.password.salt,
				nonce: password.password.nonce,
			});
		}

		console.log("Decrypted password: ", password.password.value);

		if (password.note.value) {
			password.note.value = await invoke<string>("decrypt_string", {
				encryptionKey: this.encryptionKey,
				encrypted: password.note.value,
				salt: password.note.salt,
				nonce: password.note.nonce,
			});
		}

		console.log("Decrypted note: ", password.note.value);

		return password;
	};
}

const passwords = new PasswordsState();
export default passwords;
