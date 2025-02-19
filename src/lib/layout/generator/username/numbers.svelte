<script lang="ts">
	import passwordGenerator from "@/services/passwordGenerator.svelte";

	import { Switch } from "@/components/ui/switch";
</script>

<div class="flex flex-col w-1/2 gap-1.5">
	<div class="flex flex-row w-full justify-between items-center">
		<p>Numbers</p>
	</div>
	<Switch
		disabled={passwordGenerator.isGenerating}
		bind:checked={passwordGenerator.randomWordNumbers}
	/>
</div>
