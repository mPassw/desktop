<script>
	import { page } from "$app/state";
	import { Button } from "@/components/ui/button";
	import { House } from "lucide-svelte";
</script>

<div class="flex w-full h-screen items-center justify-center">
	<div class="flex flex-col justify-center items-center">
		{#if page.status === 404}
			<h2 class="text-2xl font-semibold tracking-tight">
				Page not found
			</h2>
		{:else}
			<h2 class="text-2xl font-semibold tracking-tight">Unknown error</h2>
		{/if}
		<Button class="mt-2" variant="default" href="/">
			<House size={18} />
			Home
		</Button>
	</div>
</div>
