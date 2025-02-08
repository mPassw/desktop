<script lang="ts">
	import Login from "@/layout/root/login.svelte";
	import Registration from "@/layout/root/registration.svelte";
	import ServerValidation from "@/layout/root/serverValidation.svelte";
	import auth from "@/state/auth.svelte";
	import preferences from "@/state/preferences.svelte";
	import Icon from "@iconify/svelte";
	import server from "@/state/server.svelte";

	import { Button } from "@/components/ui/button";
	import { toggleMode } from "mode-watcher";
	import { onMount } from "svelte";
	import OfflineLogin from "@/layout/root/offlineLogin.svelte";

	const loadPreferences = async () => {
		auth.email = (await preferences.getUserEmail()) ?? "";

		await server.loadServerUrl();
		await server.loadServerAutomaticValidation();
		if (server.automaticValidation && server.serverUrl) {
			await server.validate();
		}
	};

	onMount(async () => {
		await loadPreferences();
	});
</script>

<div class="flex w-full h-full overflow-y-auto p-2">
	<div class="m-auto w-full flex justify-center">
		{#if auth.loginState === "server-validation"}
			<ServerValidation />
		{:else if auth.loginState === "login"}
			<Login />
		{:else if auth.loginState === "registration"}
			<Registration />
		{:else if auth.loginState === "offline-login"}
			<OfflineLogin />
		{/if}
	</div>
	<Button
		class="fixed bottom-2 right-2"
		variant="outline"
		size="icon"
		onclick={toggleMode}
	>
		<Icon icon="lucide:moon" font-size="24" />
	</Button>
</div>
