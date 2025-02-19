<script lang="ts">
	import MPassLoader from "@/assets/mPassLoader.svelte";
	import { blur } from "svelte/transition";

	let {
		width = 128,
		height = 128,
		dark = false,
		status = "",
	}: {
		width?: number;
		height?: number;
		dark?: boolean;
		status?: string;
	} = $props();
</script>

<div
	transition:blur={{ duration: 200 }}
	class="flex flex-col justify-center items-center h-full z-50 absolute inset-0 {dark
		? 'bg-black/50'
		: ''}"
>
	<MPassLoader {width} {height} />
	{#if status}
		<p class="text-center">{status}</p>
	{/if}
</div>
