<script lang="ts">
	import auth from "@/state/auth.svelte";

	import { goto } from "$app/navigation";
	import { Sidebar } from "@/components/ui/sidebar";
	import { onMount } from "svelte";

	let { children } = $props();

	onMount(async () => {
		if (auth.loginState !== "logged-in" && auth.loginState !== "offline") {
			await goto("/");
		}
	});
</script>

<div class="h-full px-2 w-full">
	<div class="flex flex-row w-full h-full max-w-[1400px] mx-auto">
		<Sidebar />
		{@render children()}
	</div>
</div>
