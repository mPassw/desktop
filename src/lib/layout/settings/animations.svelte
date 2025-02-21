<script lang="ts">
	import preferences from "@/services/preferences.svelte";

	import { Button } from "@/components/ui/button";
</script>

<div class="flex flex-row w-full">
	<div class="flex flex-row items-center w-full">
		<div class="flex flex-col w-1/2">
			<h3 class="leading-none">Animations</h3>
		</div>
		<div class="w-1/2 flex justify-end gap-1">
			<Button
				variant="outline"
				class={!preferences.enableAnimations ? "bg-accent" : ""}
				onclick={async () => {
					await preferences.setAnimationsSettings(false);
					preferences.enableAnimations = false;
				}}
			>
				Disabled
			</Button>
			<Button
				variant="outline"
				class={preferences.enableAnimations ? "bg-accent" : ""}
				onclick={async () => {
					await preferences.setAnimationsSettings(true);
					preferences.enableAnimations = true;
				}}
			>
				Enabled
			</Button>
		</div>
	</div>
</div>
