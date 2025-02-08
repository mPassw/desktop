<script lang="ts">
	import passwords from "@/state/passwords.svelte";
	import auth from "@/state/auth.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { getOfflineModeData } from "@/offlineMode/offlineMode.svelte";
	import { toast } from "svelte-sonner";
	import { calculateEncryptionKey } from "@/auth/login.svelte";
	import { goto } from "$app/navigation";

	let isLoading: boolean = $state(false);
	let password: string = $state("");

	const login = async () => {
		try {
			isLoading = true;

			const { encryptionKey, salt } = await getOfflineModeData();
			password = await calculateEncryptionKey(password, salt);

			if (
				encryptionKey.toString() !== passwords.encryptionKey.toString()
			) {
				throw new Error("Invalid password");
			}

			await passwords.getPasswords();

			auth.loginState = "offline";
			await goto("/dashboard/passwords");
		} catch (err: any) {
			toast.error(
				err.message ??
					"Invalid password or no offline data available. Please try online mode first."
			);
		} finally {
			isLoading = false;
		}
	};
</script>

<svelte:document
	onkeydown={async (e) => {
		if (e.key === "Enter" && auth.loginState === "offline-login") {
			await login();
		}
	}}
/>

<Blurfade delay={0} class="flex flex-col items-center w-full gap-1.5">
	<h3 class="text-2xl font-semibold">Offline Login</h3>
	<div class="flex flex-col items-center gap-2">
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
	<div
		class="flex flex-row w-full justify-center items-center max-w-[300px] gap-1.5"
	>
		<Button
			onclick={() => (auth.loginState = "server-validation")}
			disabled={isLoading}
			variant="secondary"
			class="w-1/2"
		>
			Online Mode
		</Button>
		<Button
			onclick={login}
			disabled={isLoading}
			class="w-1/2 font-semibold"
		>
			Login
		</Button>
	</div>
</Blurfade>
