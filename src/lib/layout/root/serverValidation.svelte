<script lang="ts">
	import authState from "@/state/auth.svelte";
	import serverState from "@/state/server.svelte";
	import loadersState from "@/state/loaders.svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Checkbox } from "@/components/ui/checkbox";
	import { Label } from "@/components/ui/label";
	import { Blurfade } from "@/components/animations/blurfade";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";

	const validateServer = async () => {
		try {
			loadersState.isFullscreenLoaderVisible = true;

			if (!serverState.serverUrl) {
				throw new Error("Server URL is required");
			}

			await serverState.validate();
		} catch (err: any) {
			toast.error(err.message ?? "Unknown error");
		} finally {
			loadersState.isFullscreenLoaderVisible = false;
		}
	};
</script>

<svelte:document
	onkeydown={async (e) => {
		if (e.key === "Enter" && authState.loginState === "server-validation") {
			await validateServer();
		}
	}}
/>

<Blurfade delay={0} class="flex flex-col items-center w-full gap-1.5">
	<div class="flex flex-col items-center">
		<h3 class="text-2xl font-semibold">Server validation</h3>
		<p class="text-md text-muted-foreground">
			Enter the URL of your mPass instance
		</p>
	</div>
	<Input
		bind:value={serverState.serverUrl}
		class="w-80"
		placeholder="https://example.com"
		type="url"
	/>
	<div class="flex items-center space-x-2 mt-2">
		<Checkbox
			bind:checked={serverState.automaticValidation}
			id="auto-validate"
			aria-labelledby="auto-validate-label"
		/>
		<Label
			id="auto-validate-label"
			for="auto-validate"
			class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			Automatically validate server on app start
		</Label>
	</div>
	<div class="flex flex-row gap-1.5 w-80">
		<Button
			variant="secondary"
			class="w-1/2 font-medium"
			onclick={async () => {
				authState.loginState = "offline-login";
			}}
		>
			Offline Mode
		</Button>
		<Button class="w-1/2 font-medium" onclick={validateServer}>Next</Button>
	</div>
</Blurfade>
