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

	public id: string = $state("");
	public email: string = $state("");
	public username: string = $state("");

	public createdAt: string = $state("");
	public updatedAt: string = $state("");

	public isEmailVerificationDialogOpen: boolean = $state(false);

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

	private updateUser = async (
		code: string,
		newEmail?: string,
		newUsername?: string,
		salt?: string,
		verifier?: string
	) => {
		await makeRequest("/users/@me", "PATCH", {
			authorization: true,
			body: JSON.stringify({
				code: code,
				email: newEmail?.length ? newEmail : null,
				username: newUsername?.length ? newUsername : null,
				salt: salt?.length ? salt : null,
				verifier: verifier?.length ? verifier : null,
				passwords:
					newEmail?.length || salt?.length || verifier?.length
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

	public updateData = async (
		masterPassword: string,
		code: string,
		newEmail?: string,
		newUsername?: string,
		newPassword?: string
	) => {
		let salt: string | undefined;
		let verifier: string | undefined;

		if (newEmail || newPassword) {
			await passwords.decryptAllPasswords();

			const saltAndVerifier = await generateSaltAndVerifier(
				newEmail?.length ? newEmail : this.email,
				newPassword?.length ? newPassword : masterPassword
			);

			salt = saltAndVerifier.salt;
			verifier = saltAndVerifier.verifier;

			passwords.encryptionKey = await calculateEncryptionKey(
				newPassword?.trim().length ? newPassword : masterPassword,
				salt
			);

			await passwords.encryptAllPasswords();
		}

		await this.updateUser(code, newEmail, newUsername, salt, verifier);
	};

	public invalidateSessions = async () => {
		await makeRequest("/users/@me/sessions", "POST", {
			authorization: true,
		});

		await this.logOut();
	};

	public logOut = async () => {
		await goto("/");

		// page reload SHOULD clean the memory
		window.location.reload();
	};
}

const auth = new AuthState();
export default auth;
