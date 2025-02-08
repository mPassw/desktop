import { goto } from "$app/navigation";
import { getJWTExpiration } from "@/utils";
import { toast } from "svelte-sonner";

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

	public authToken: string = $state("");
	public timeOutId: Timer | null = $state(null);

	public isAdmin: boolean = $state(false);
	public isVerified: boolean = $state(false);

	public email: string = $state("");
	public username: string = $state("");

	public createdAt: string = $state("");
	public updatedAt: string = $state("");

	public isOfflineMode: boolean = $derived(this.loginState === "offline" || this.loginState === 'offline-login');

	public setLogoutTimer = () => {
		const expiration = getJWTExpiration(this.authToken);
		if (!expiration) throw new Error("Invalid token");

		const now = Date.now();
		const timeLeft = expiration * 1000 - now;

		this.timeOutId = setTimeout(async () => {
			await this.logOut();
			toast.warning("Session expired");
		}, timeLeft);
	};

	public logOut = async () => {
		// if (this.timeOutId) {
		// 	clearTimeout(this.timeOutId);
		// }

		// this.authToken = "";
		// this.isAdmin = false;
		// this.isVerified = false;

		// this.email = "";
		// this.username = "";

		// this.createdAt = "";
		// this.updatedAt = "";

		// passwords.encryptionKey = new Uint8Array(0);
		// passwords.passwords = [];

		// reloading page SHOULD clear memory
		await goto("/");
		window.location.reload();
	};
}

const auth = new AuthState();
export default auth;
