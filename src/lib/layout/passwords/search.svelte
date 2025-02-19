<script lang="ts">
	import Icon from "@iconify/svelte";
	import NewPasswordDialog from "./newPasswordDialog.svelte";
	import loadersState from "@/services/loaders.svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";

	let {
		searchValue = $bindable(),
		isPageTrash,
		fetchPasswords,
	}: {
		searchValue: string;
		isPageTrash: boolean;
		fetchPasswords: () => Promise<void>;
	} = $props();
</script>

<div class="flex flex-row items-center gap-1.5 w-full absolute top-3 pr-6">
	<Input
		bind:value={searchValue}
		disabled={loadersState.isPasswordsLoaderVisible}
		placeholder="Search by Title, Website or Tag"
	/>
	<div class="flex flex-row gap-1.5">
		{#if !isPageTrash}
			<NewPasswordDialog />
		{/if}
		<Button
			onclick={fetchPasswords}
			disabled={loadersState.isPasswordsLoaderVisible}
			variant="outline"
			size="icon"
		>
			<Icon icon="lucide:refresh-cw" font-size="20" />
		</Button>
	</div>
</div>
