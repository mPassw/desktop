<script lang="ts">
	import MPassLoader from "@/assets/mPassLoader.svelte";
	import loadersState from "@/services/loaders.svelte";

	import { blur } from "svelte/transition";

	let {
		dark = false,
	}: {
		dark?: boolean;
	} = $props();
</script>

{#if loadersState.isFullscreenLoaderVisible}
	<div
		transition:blur={{ duration: 200 }}
		class="fixed flex justify-center items-center w-full h-screen z-50 {dark
			? 'bg-black/50'
			: ''}"
	>
		<MPassLoader width={256} height={256} />
	</div>
{/if}
