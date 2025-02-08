import server from "./server.svelte";
import auth from "./auth.svelte";

import { fetch } from "@tauri-apps/plugin-http";
import { getErrorMessage } from "@/utils";
import { invoke } from "@tauri-apps/api/core";
import { getOfflineModePasswords } from "@/offlineMode/offlineMode.svelte";

interface EncryptedField {
	value: string;
	salt: string;
	nonce: string;
}

export interface Password {
	id: number;

	inTrash: boolean;
	title: string;

	username?: EncryptedField;
	password?: EncryptedField;
	note?: EncryptedField;

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

			const decrypted = await invoke<string>("decrypt_password", {
				encryptionKey: this.encryptionKey,
				password:
					this.passwords[this.passwords.length - 1].password?.value,
				salt: this.passwords[this.passwords.length - 1].password?.salt,
				nonce: this.passwords[this.passwords.length - 1].password
					?.nonce,
			});

			this.passwords[this.passwords.length - 1].password!.value =
				decrypted;
		}

		if (this.passwords.length) {
			this.selectedPassword = this.passwords[0];
		} else {
			this.selectedPassword = null;
		}
	};

	public setSelectedPassword = (password: Password) => {
		this.selectedPassword = password;
	};

	public encryptPassword = async () => {
		const encryptedData = await invoke<{
			password: string;
			salt: Uint8Array;
			nonce: Uint8Array;
		}>("encrypt_password", {
			encryptionKey: passwords.encryptionKey,
			password: "!Goodfood234",
		});

		console.log(encryptedData.password.length);
		console.log(encryptedData.salt.length);
		console.log(encryptedData.nonce.length);

		const res = await fetch(server.serverUrl + "/passwords/add", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${auth.authToken}`,
			},
			body: JSON.stringify({
				title: "Test",
				password: {
					value: encryptedData.password,
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
	};
}

const passwords = new PasswordsState();
export default passwords;
