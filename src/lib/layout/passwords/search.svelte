<script lang="ts">
	import auth from "@/state/auth.svelte";
	import passwords from "@/state/passwords.svelte";
	import Icon from "@iconify/svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";

	let {
		isLoading,
		searchValue = $bindable(),
		isPageTrash,
		fetchPasswords,
	}: {
		isLoading: boolean;
		searchValue: string;
		isPageTrash: boolean;
		fetchPasswords: () => Promise<void>;
	} = $props();
</script>

<div class="flex flex-row items-center gap-1.5 w-full absolute top-3 pr-6">
	<Input
		bind:value={searchValue}
		disabled={isLoading}
		placeholder="Search by Title, Website or Tag"
	/>
	<div class="flex flex-row gap-1.5">
		<Button
			onclick={async () => await passwords.encryptPassword()}
			disabled={isLoading || auth.isOfflineMode}
			variant="outline"
			size="icon"
			class={isPageTrash ? "hidden" : ""}
		>
			<Icon icon="lucide:plus" font-size="20" />
		</Button>
		<Button
			onclick={fetchPasswords}
			disabled={isLoading}
			variant="outline"
			size="icon"
		>
			<Icon icon="lucide:refresh-cw" font-size="20" />
		</Button>
	</div>
</div>
