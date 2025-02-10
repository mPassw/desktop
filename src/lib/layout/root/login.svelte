<script lang="ts">
	import passwords from "@/state/passwords.svelte";
	import preferences from "@/state/preferences.svelte";
	import auth from "@/state/auth.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { Button } from "@/components/ui/button";
	import { Label } from "@/components/ui/label";
	import { Input } from "@/components/ui/input";
	import { toast } from "svelte-sonner";
	import { calculateEncryptionKey, step1, step2 } from "@/auth/login.svelte";
	import { SRPClientSession, SRPParameters, SRPRoutines } from "tssrp6a";
	import { goto } from "$app/navigation";
	import { getMe } from "@/auth/getMe.svelte";
	import { saveOfflineModeData } from "@/offlineMode/offlineMode.svelte";

	let isLoading: boolean = $state(false);

	let authId: string | undefined = $state(undefined);
	let email: string = $state(auth.email);
	let password: string = $state("");

	const login = async () => {
		try {
			isLoading = true;

			if (!email) {
				throw new Error("Email/Username is required");
			}

			if (!password) {
				throw new Error("Password is required");
			}

			const step1Response = await step1(email);
			authId = step1Response.authId;
			email = step1Response.email;

			const saltBytes = new Uint8Array(
				step1Response.salt
					.match(/.{1,2}/g)
					?.map((byte) => parseInt(byte, 16)) ?? []
			);

			const srpClient = new SRPClientSession(
				new SRPRoutines(new SRPParameters())
			);

			const srpClientStep1 = await srpClient.step1(email, password);
			const srpClientStep2 = await srpClientStep1.step2(
				BigInt("0x" + step1Response.salt),
				BigInt("0x" + step1Response.B)
			);

			const step2Response = await step2(
				authId,
				srpClientStep2.A.toString(16),
				srpClientStep2.M1.toString(16)
			);

			await srpClientStep2.step3(BigInt("0x" + step2Response.M2));

			password = await calculateEncryptionKey(
				password,
				step1Response.salt
			);

			auth.setLogoutTimer();

			await saveOfflineModeData(step1Response.salt);
			await getMe();
			await preferences.setUserEmail(email);

			auth.loginState = "logged-in";
			await goto("/dashboard/passwords");
		} catch (err: any) {
			toast.error(err.message ?? "Unknown error");
			passwords.encryptionKey = new Uint8Array(0);
		} finally {
			authId = undefined;
			isLoading = false;
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
		<div class="flex w-[300px] flex-col gap-1.5">
			<Label for="email">Email/Username</Label>
			<Input
				bind:value={email}
				disabled={isLoading}
				type="email"
				id="email"
				placeholder="mail@example.com"
			/>
		</div>
		<div class="flex w-[300px] flex-col gap-1.5">
			<Label for="password">Password</Label>
			<Input
				bind:value={password}
				disabled={isLoading}
				type="password"
				id="password"
				placeholder="********"
			/>
		</div>
	</div>
	<Button
		disabled={isLoading}
		onclick={login}
		class="w-[300px] mt-1.5 font-semibold"
	>
		Login
	</Button>
	<div class="flex flex-row justify-between w-full max-w-[300px]">
		<Button
			onclick={() => (auth.loginState = "server-validation")}
			disabled={isLoading}
			variant="link"
			class="text-muted-foreground"
		>
			Change server URL
		</Button>

		<Button
			onclick={() => (auth.loginState = "registration")}
			disabled={isLoading}
			variant="link"
			class="text-muted-foreground"
		>
			Create account
		</Button>
	</div>
</Blurfade>
