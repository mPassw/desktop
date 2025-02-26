<script lang="ts">
	import passwords from "@/services/passwords.svelte";
	import preferences from "@/services/preferences.svelte";
	import auth from "@/services/auth.svelte";
	import loadersState from "@/services/loaders.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { Button } from "@/components/ui/button";
	import { Label } from "@/components/ui/label";
	import { Input } from "@/components/ui/input";
	import { toast } from "svelte-sonner";
	import { calculateEncryptionKey, step1, step2 } from "@/auth/login.svelte";
	import { goto } from "$app/navigation";
	import { getMe } from "@/auth/getMe.svelte";
	import { saveOfflineModeData } from "@/offlineMode/offlineMode.svelte";
	import { invoke } from "@tauri-apps/api/core";

	let authId: string | undefined = $state(undefined);
	let email: string = $state(auth.email);
	let password: string = $state("");

	const login = async () => {
		try {
			loadersState.isFullscreenLoaderVisible = true;

			if (!email) {
				throw new Error("Email/Username is required");
			}

			if (!password) {
				throw new Error("Password is required");
			}

			const step1Response = await step1(email);
			authId = step1Response.authId;
			email = step1Response.email;
			auth.salt = step1Response.salt;

			const { private_key, public_key } = await invoke<{
				private_key: string;
				public_key: string;
			}>("generate_srp_credentials");

			const m1 = await invoke<string>("calculate_srp_proof", {
				privateKey: private_key,
				username: email,
				password: password,
				salt: step1Response.salt,
				serverB: step1Response.b,
			});

			await step2(authId, public_key, m1);

			passwords.encryptionKey = await calculateEncryptionKey(
				password,
				step1Response.salt
			);
			password = "";

			auth.setLogoutTimer();

			await saveOfflineModeData(step1Response.salt);
			await getMe();
			await preferences.setUserEmail(email);

			auth.loginState = "logged-in";
			await goto("/dashboard/passwords");

			// console.log(auth.authToken);
		} catch (err: any) {
			console.error(err);
			toast.error(err.message ?? "Unknown error");
			passwords.encryptionKey = new Uint8Array(0);
		} finally {
			authId = undefined;
			loadersState.isFullscreenLoaderVisible = false;
		}
	};
</script>

<svelte:document
	onkeydown={async (e) => {
		if (e.key === "Enter" && auth.loginState === "login") {
			await login();
		}
	}}
/>

<Blurfade delay={0} class="flex flex-col items-center w-full gap-1.5">
	<h3 class="text-2xl font-semibold">Login</h3>
	<div class="flex flex-col items-center gap-2">
		<div class="flex w-80 flex-col gap-1.5">
			<Label for="email">Email/Username</Label>
			<Input
				bind:value={email}
				type="email"
				id="email"
				placeholder="mail@example.com"
			/>
		</div>
		<div class="flex w-80 flex-col gap-1.5">
			<Label for="password">Password</Label>
			<Input
				bind:value={password}
				type="password"
				id="password"
				placeholder="********"
			/>
		</div>
	</div>
	<Button onclick={login} class="w-80 mt-1.5 font-semibold">Login</Button>
	<div class="flex flex-row justify-between w-full max-w-80">
		<Button
			onclick={() => (auth.loginState = "server-validation")}
			variant="link"
			class="text-muted-foreground"
		>
			Change server URL
		</Button>

		<Button
			onclick={() => (auth.loginState = "registration")}
			variant="link"
			class="text-muted-foreground"
		>
			Create account
		</Button>
	</div>
</Blurfade>
