<script lang="ts">
	import MPassLoader from "@/assets/mPassLoader.svelte";

	import { blur } from "svelte/transition";

	let {
		width = 128,
		height = 128,
		dark = false,
	}: {
		width?: number;
		height?: number;
		dark?: boolean;
	} = $props();
</script>

<div
	transition:blur={{ duration: 200 }}
	class="flex justify-center items-center h-full z-50 absolute inset-0 {dark
		? 'bg-black/50'
		: ''}"
>
	<MPassLoader {width} {height} />
</div>
