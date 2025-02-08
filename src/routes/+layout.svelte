<script lang="ts">
	import "../app.css";

	import * as Tooltip from "$lib/components/ui/tooltip";
	import preferences from "@/state/preferences.svelte";
	import Decorations from "@/layout/root/decorations.svelte";
	import osInfo from "@/state/osInfo.svelte";
	import auth from "@/state/auth.svelte";

	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "@/components/ui/sonner";
	import { onMount } from "svelte";
	import { arch, hostname, type, version } from "@tauri-apps/plugin-os";

	let { children } = $props();

	onMount(async () => {
		osInfo.os = type();
		osInfo.version = version();
		osInfo.arch = arch();
		osInfo.hostname = (await hostname()) ?? "unknown";

		const decorations = await preferences.getWindowDecorations();
		await preferences.setWindowDecorations(decorations ?? "system");

		auth.sessionLength = await preferences.getSessionLength();
	});
</script>

<ModeWatcher />
<Toaster richColors class="select-none" />

<Tooltip.Provider delayDuration={100}>
	<div class="h-screen flex flex-col">
		{#if preferences.windowDecorations === "custom"}
			<Decorations />
		{/if}
		<div class="flex-1 overflow-y-hidden">
			{@render children()}
		</div>
	</div>
</Tooltip.Provider>
