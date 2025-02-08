<script lang="ts">
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
	import auth from "@/state/auth.svelte";
	import preferences from "@/state/preferences.svelte";

	const values = ["5m", "10m", "30m", "1h", "2h"];

	$effect(() => {
		(async () => {
			preferences.setSessionLength(auth.sessionLength);
		})();
	});
</script>

<div class="flex flex-row w-full">
	<div class="flex flex-row items-center w-full">
		<div class="flex flex-col w-1/2">
			<h3 class="leading-none">Session Length</h3>
			<p class="text-muted-foreground text-sm">
				Changes will take effect upon next login
			</p>
		</div>
		<ToggleGroup.Root
			bind:value={auth.sessionLength}
			type="single"
			variant="outline"
			class="w-1/2 justify-end"
		>
			{#each values as lengthValue}
				<ToggleGroup.Item
					value={lengthValue}
					aria-label="Session length {lengthValue}"
				>
					<p>{lengthValue}</p>
				</ToggleGroup.Item>
			{/each}
		</ToggleGroup.Root>
	</div>
</div>
