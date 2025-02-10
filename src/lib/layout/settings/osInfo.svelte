<script lang="ts">
	import auth from "@/state/auth.svelte";
	import osInfo from "@/state/osInfo.svelte";
	import server from "@/state/server.svelte";
	import { getVersion } from "@tauri-apps/api/app";
	import { onMount } from "svelte";

	let appVersion: string = $state("");

	onMount(async () => {
		appVersion = await getVersion();
	});
</script>

<div class="flex flex-col w-full">
	<div class="flex flex-col gap-1.5">
		<div class="flex flex-col">
			<h3 class="leading-none">App Version</h3>
			<p class="text-muted-foreground">{appVersion}</p>
		</div>
		<div class="flex flex-col">
			<h3 class="leading-none">Server Version</h3>
			<p class="text-muted-foreground">
				{auth.isOfflineMode ? "offline-mode" : server.serverVersion}
			</p>
		</div>
		<div class="flex flex-col">
			<h3 class="leading-none">Operating System Type</h3>
			<p class="text-muted-foreground">{osInfo.os}</p>
		</div>
		<div class="flex flex-col">
			<h3 class="leading-none">Version</h3>
			<p class="text-muted-foreground">{osInfo.version}</p>
		</div>
		<div class="flex flex-col">
			<h3 class="leading-none">Arch</h3>
			<p class="text-muted-foreground">{osInfo.arch}</p>
		</div>
		<div class="flex flex-col">
			<h3 class="leading-none">Hostname</h3>
			<p class="text-muted-foreground">{osInfo.hostname}</p>
		</div>
	</div>
</div>
