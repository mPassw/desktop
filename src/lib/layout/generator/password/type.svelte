<script lang="ts">
	import * as Select from "$lib/components/ui/select";
	import passwordGenerator from "@/state/passwordGenerator.svelte";

	let selected: string = $derived(
		passwordGenerator.passwordType.charAt(0).toUpperCase() +
			passwordGenerator.passwordType.slice(1)
	);
</script>

<div class="flex flex-col gap-1.5 w-full pr-6">
	<p>Type</p>
	<Select.Root type="single" bind:value={passwordGenerator.passwordType}>
		<Select.Trigger class="w-1/2">{selected}</Select.Trigger>
		<Select.Content>
			<Select.Item value="password">Password</Select.Item>
			<Select.Item value="passphrase">Passphrase</Select.Item>
		</Select.Content>
	</Select.Root>
</div>
