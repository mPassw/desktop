<script lang="ts">
	import * as Select from "$lib/components/ui/select";
	import passwordGenerator from "@/services/passwordGenerator.svelte";

	let selected: string = $derived(
		passwordGenerator.usernameType === "addressedEmail"
			? "Addressed Email"
			: "Random Word"
	);
</script>

<div class="flex flex-col gap-1.5 w-full pr-6">
	<p>Type</p>
	<Select.Root type="single" bind:value={passwordGenerator.usernameType}>
		<Select.Trigger class="w-1/2">{selected}</Select.Trigger>
		<Select.Content>
			<Select.Item value="addressedEmail">Addressed Email</Select.Item>
			<Select.Item value="randomWord">Random Word</Select.Item>
		</Select.Content>
	</Select.Root>
</div>
