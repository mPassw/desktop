<script lang="ts">
	import "../app.css";

	import * as Tooltip from "$lib/components/ui/tooltip";
	import preferences from "@/state/preferences.svelte";
	import Decorations from "@/layout/root/decorations.svelte";
	import osInfo from "@/state/osInfo.svelte";
	import auth from "@/state/auth.svelte";
	import loadersState from "@/state/loaders.svelte";

	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "@/components/ui/sonner";
	import { onMount } from "svelte";
	import { arch, hostname, type, version } from "@tauri-apps/plugin-os";
	import { getVersion } from "@tauri-apps/api/app";
	import { FullScreenLoader } from "@/components/animations/loaders";

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
<FullScreenLoader />

{#if process.env.NODE_ENV === "development"}
	<p
		class="fixed bottom-1 right-1 text-center text-xs text-muted-foreground z-50 select-none"
	>
		Debug
	</p>
{/if}

<Tooltip.Provider delayDuration={100}>
	<main class="h-screen flex flex-col select-none">
		{#if preferences.windowDecorations === "custom"}
			<Decorations />
		{/if}
		<div
			class="flex-1 overflow-y-hidden {loadersState.isFullscreenLoaderVisible
				? 'blur-sm pointer-events-none'
				: ''}"
		>
			{@render children()}
		</div>
		<button
			onclick={() => {
				loadersState.isFullscreenLoaderVisible = true;
				setTimeout(() => {
					loadersState.isFullscreenLoaderVisible = false;
				}, 2000);
			}}>asd</button
		>
	</main>
</Tooltip.Provider>
