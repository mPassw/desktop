<script>
	import MPassLoader from "@/assets/mPassLoader.svelte";
	import loadersState from "@/state/loaders.svelte";

	import { blur } from "svelte/transition";
</script>

{#if loadersState.isFullscreenLoaderVisible}
	<div
		transition:blur={{ duration: 200 }}
		class="fixed flex justify-center items-center w-full h-screen bg-background/50 z-50"
	>
		<MPassLoader width={256} height={256} />
	</div>
{/if}
