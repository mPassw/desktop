import { invoke } from "@tauri-apps/api/core";
import { httpService } from "../http/http.service.svelte";
import { passwordsState } from "./passwords.state.svelte";
import type {
    EncryptedFieldResponse,
    NewPassword,
    Password,
} from "./passwords.types.svelte";
import { page } from "$app/state";
import { offlineModeService } from "../offlineMode/offlineMode.service.svelte";
import { authState } from "../auth/auth.state.svelte";

class PasswordsService {
    public isValidPassword = async (password: string): Promise<boolean> => {
        const encryptionKey = await this.calculateEncryptionKey(
            password,
            passwordsState.salt,
        );

        return (
            passwordsState.encryptionKey.toString() === encryptionKey.toString()
        );
    };

    public calculateEncryptionKey = async (
        password: string,
        salt: string,
    ): Promise<Uint8Array> =>
        await invoke<Uint8Array>("get_encryption_key", {
            password,
            salt,
        });

    public fetchPasswords = async (
        passwordToSelect?: Password,
    ): Promise<void> => {
        passwordsState.passwords = [];
        passwordsState.selectedPassword = null;

        const res = await httpService.makeRequest("/passwords", {
            method: "GET",
            authorization: true,
        });

        passwordsState.passwords = (await res.json()) as Password[];
        passwordsState.passwords.reverse();

        if (passwordsState.passwords.length) {
            await offlineModeService.saveData(
                authState.user!.email,
                passwordsState.encryptionKey,
                passwordsState.salt,
                passwordsState.passwords,
            );
        }

        if (passwordToSelect) {
            await this.setSelectedPassword(passwordToSelect);
        } else if (passwordsState.passwords.length) {
            // since all these functions are used in `passwords` and `trash` pages
            // we need to check if the current page is the trash page
            const isTrashPage = page.url.pathname === "/dashboard/trash";

            const passwordToSet = passwordsState.passwords.find(
                (p) => p.inTrash === isTrashPage,
            );

            if (passwordToSet) {
                await this.setSelectedPassword(passwordToSet);
            }
        }
    };

    public addPassword = async (password: NewPassword): Promise<void> => {
        const encryptedPassword = await this.encryptPassword(
            password as Password,
        );

        await httpService.makeRequest("/passwords", {
            method: "POST",
            authorization: true,
            body: JSON.stringify({
                title: encryptedPassword.title,
                username: encryptedPassword.username?.length
                    ? encryptedPassword.username
                    : null,
                password: encryptedPassword.password?.length
                    ? encryptedPassword.password
                    : null,
                note: encryptedPassword.note?.length
                    ? encryptedPassword.note
                    : null,
                websites: encryptedPassword.websites,
                tags: encryptedPassword.tags,
            }),
        });

        await this.fetchPasswords();
    };

    public importPasswords = async (
        passwords: NewPassword[],
    ): Promise<void> => {
        await httpService.makeRequest("/passwords/bulk", {
            method: "POST",
            authorization: true,
            body: JSON.stringify({
                passwords: await Promise.all(
                    passwords.map(async (password) => {
                        return await this.encryptPassword(password as Password);
                    }),
                ),
            }),
        });

        await this.fetchPasswords();
    };

    public setSelectedPassword = async (password: Password): Promise<void> => {
        if (passwordsState.selectedPassword?.id === password.id) {
            return;
        }

        passwordsState.isInEditMode = false;
        passwordsState.selectedPassword = await this.decryptPassword(password);
    };

    public encryptPassword = async (password: Password): Promise<Password> => {
        // create a copy of the password object, so we don't modify the original
        const encryptedPassword: Password = { ...password };

        if (encryptedPassword.username) {
            const parts = encryptedPassword.username.split(":");

            if (parts.length === 1) {
                const { encrypted, salt, nonce } =
                    await invoke<EncryptedFieldResponse>("encrypt_string", {
                        encryptionKey: passwordsState.encryptionKey,
                        plaintext: encryptedPassword.username,
                    });

                encryptedPassword.username = `${encrypted}:${salt}:${nonce}`;
            }
        }

        if (encryptedPassword.password) {
            const parts = encryptedPassword.password.split(":");

            if (parts.length === 1) {
                const { encrypted, salt, nonce } =
                    await invoke<EncryptedFieldResponse>("encrypt_string", {
                        encryptionKey: passwordsState.encryptionKey,
                        plaintext: encryptedPassword.password,
                    });

                encryptedPassword.password = `${encrypted}:${salt}:${nonce}`;
            }
        }

        if (encryptedPassword.note) {
            const parts = encryptedPassword.note.split(":");

            if (parts.length === 1) {
                const { encrypted, salt, nonce } =
                    await invoke<EncryptedFieldResponse>("encrypt_string", {
                        encryptionKey: passwordsState.encryptionKey,
                        plaintext: encryptedPassword.note,
                    });

                encryptedPassword.note = `${encrypted}:${salt}:${nonce}`;
            }
        }

        return encryptedPassword;
    };

    public decryptPassword = async (password: Password): Promise<Password> => {
        // create a copy of the password object, so we don't modify the original
        const decryptedPassword: Password = { ...password };

        if (decryptedPassword.username) {
            const parts = decryptedPassword.username.split(":");

            if (parts.length === 3) {
                decryptedPassword.username = await invoke("decrypt_string", {
                    encryptionKey: passwordsState.encryptionKey,
                    encrypted: parts[0],
                    salt: parts[1],
                    nonce: parts[2],
                });
            }
        }

        if (decryptedPassword.password) {
            const parts = decryptedPassword.password.split(":");

            if (parts.length === 3) {
                decryptedPassword.password = await invoke("decrypt_string", {
                    encryptionKey: passwordsState.encryptionKey,
                    encrypted: parts[0],
                    salt: parts[1],
                    nonce: parts[2],
                });
            }
        }

        if (decryptedPassword.note) {
            const parts = decryptedPassword.note.split(":");

            if (parts.length === 3) {
                decryptedPassword.note = await invoke("decrypt_string", {
                    encryptionKey: passwordsState.encryptionKey,
                    encrypted: parts[0],
                    salt: parts[1],
                    nonce: parts[2],
                });
            }
        }

        return decryptedPassword;
    };

    public updatePassword = async (
        password: Password,
        selectUpdatedPassword: boolean = false,
    ): Promise<void> => {
        const encryptedPassword = await this.encryptPassword(password);

        await httpService.makeRequest("/passwords", {
            method: "PATCH",
            authorization: true,
            body: JSON.stringify({
                id: encryptedPassword.id,
                title: encryptedPassword.title,
                inTrash: encryptedPassword.inTrash,
                username: encryptedPassword.username,
                password: encryptedPassword.password,
                note: encryptedPassword.note,
                websites: encryptedPassword.websites,
                tags: encryptedPassword.tags,
            }),
        });

        await this.fetchPasswords(
            selectUpdatedPassword ? encryptedPassword : undefined,
        );
    };

    public movePasswordToTrash = async (password: Password): Promise<void> =>
        await this.updatePassword({ ...password, inTrash: true });

    public restorePassword = async (password: Password): Promise<void> =>
        await this.updatePassword({ ...password, inTrash: false });

    public deletePassword = async (password: Password): Promise<void> => {
        await httpService.makeRequest(`/passwords/${password.id}`, {
            method: "DELETE",
            authorization: true,
        });

        await this.fetchPasswords();
    };

    public decryptAllPasswords = async (): Promise<void> => {
        const decryptedPasswords = [];
        for (let i = 0; i < passwordsState.passwords.length; i++) {
            decryptedPasswords.push(
                await this.decryptPassword(passwordsState.passwords[i]),
            );
        }
        passwordsState.passwords = decryptedPasswords;
    };

    public encryptAllPasswords = async (): Promise<void> => {
        const encryptedPasswords = [];
        for (let i = 0; i < passwordsState.passwords.length; i++) {
            encryptedPasswords.push(
                await this.encryptPassword(passwordsState.passwords[i]),
            );
        }
        passwordsState.passwords = encryptedPasswords;
    };
}

export const passwordsService = new PasswordsService();
