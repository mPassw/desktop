import passwords from "./passwords.svelte";

import { goto } from "$app/navigation";
import { getJWTExpiration, makeRequest } from "@/utils";
import { toast } from "svelte-sonner";
import { generateSaltAndVerifier } from "@/auth/createUser.svelte";
import { calculateEncryptionKey } from "@/auth/login.svelte";

class AuthState {
	public loginState:
		| "offline-login"
		| "offline"
		| "server-validation"
		| "login"
		| "registration"
		| "2fa"
		| "logged-in" = $state("server-validation");
	public sessionLength: "5m" | "10m" | "30m" | "1h" | "2h" = $state("30m");

	public salt: string = $state("");
	public authToken: string = $state("");

	public isAdmin: boolean = $state(false);
	public isVerified: boolean = $state(false);

	public id: number = $state(0);
	public email: string = $state("");
	public username: string = $state("");

	public createdAt: string = $state("");
	public updatedAt: string = $state("");

	/**
	 * This is just a helper to check if the user is in offline mode
	 */
	public isOfflineMode: boolean = $derived(
		this.loginState === "offline" || this.loginState === "offline-login"
	);

	public setLogoutTimer = () => {
		const expiration = getJWTExpiration(this.authToken);
		if (!expiration) throw new Error("Invalid token");

		const now = Date.now();
		const timeLeft = expiration * 1000 - now;

		setTimeout(async () => {
			await this.logOut();
			toast.warning("Session expired");
		}, timeLeft);
	};

	public updateUser = async (
		newEmail: string | null,
		newUsername: string | null,
		salt: bigint | null,
		verifier: bigint | null,
		updatePasswords: boolean = false
	) => {
		await makeRequest("/users/@me", "PATCH", {
			authorization: true,
			body: JSON.stringify({
				email: newEmail,
				username: newUsername,
				salt: salt ? salt.toString(16) : null,
				verifier: verifier ? verifier.toString(16) : null,
				passwords: updatePasswords
					? passwords.passwords.map((p) => ({
							id: p.id,
							title: p.title,
							username: p.username,
							password: p.password,
							note: p.note,
							websites: p.websites,
							tags: p.tags,
							inTrash: p.inTrash,
					  }))
					: null,
			}),
		});
	};

	public updateEmail = async (newEmail: string, masterPassword: string) => {
		await passwords.decryptAllPasswords();

		for (const pwd of passwords.passwords) {
			console.log(pwd.username ?? pwd.password);
		}

		const { salt, verifier } = await generateSaltAndVerifier(
			newEmail,
			masterPassword
		);
		passwords.encryptionKey = await calculateEncryptionKey(
			masterPassword,
			salt.toString(16)
		);

		await passwords.encryptAllPasswords();

		await this.updateUser(newEmail, null, salt, verifier, true);
	};

	public logOut = async () => {
		await goto("/");

		// page reload SHOULD clean the memory
		window.location.reload();
	};
}

const auth = new AuthState();
export default auth;
