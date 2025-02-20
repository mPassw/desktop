<script lang="ts">
	import NewPasswordDialog from "./newPasswordDialog.svelte";
	import loadersState from "@/services/loaders.svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { RefreshCw } from "lucide-svelte";

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
		disabled={loadersState.isLoaderVisible}
		placeholder="Search by Title, Website or Tag"
	/>
	<div class="flex flex-row gap-1.5">
		{#if !isPageTrash}
			<NewPasswordDialog />
		{/if}
		<Button
			onclick={fetchPasswords}
			disabled={loadersState.isLoaderVisible}
			variant="outline"
			size="icon"
		>
			<RefreshCw size={20} />
		</Button>
	</div>
</div>
