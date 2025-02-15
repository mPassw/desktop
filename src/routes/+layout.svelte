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
	import { getVersion } from "@tauri-apps/api/app";

	let { children } = $props();

	onMount(async () => {
		osInfo.os = type();
		osInfo.version = version();
		osInfo.arch = arch();
		osInfo.hostname = (await hostname()) ?? "unknown";
		osInfo.appVersion = await getVersion();

		await preferences.setWindowDecorations(
			(await preferences.getWindowDecorations()) ?? "system"
		);
		await preferences.setWindowsDecorationsSide(
			(await preferences.getWindowsDecorationsSide()) ?? "right"
		);

		auth.sessionLength = await preferences.getSessionLength();
	});
</script>

<ModeWatcher />
<Toaster richColors class="select-none" />

{#if process.env.NODE_ENV === "development"}
	<p
		class="fixed bottom-1 right-1 text-center text-xs text-muted-foreground z-50 select-none"
	>
		Debug
	</p>
{/if}

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
