<script lang="ts">
	import MPassLoader from "@/assets/mPassLoader.svelte";

	import { blur } from "svelte/transition";

	let {
		width = 128,
		height = 128,
	}: {
		width?: number;
		height?: number;
	} = $props();
</script>

<div
	transition:blur={{ duration: 200 }}
	class="flex justify-center items-center h-full bg-background/50 z-50 absolute inset-0"
>
	<MPassLoader {width} {height} />
</div>
