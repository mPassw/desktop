<script lang="ts">
	import auth from "@/services/auth.svelte";
	import passwords from "@/services/passwords.svelte";
	import Icon from "@iconify/svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";

	let {
		copyText,
	}: {
		copyText: (text: string) => Promise<void>;
	} = $props();
</script>

<div class="flex flex-col gap-1">
	<h3 class="text-xl">Username</h3>
	{#if passwords.selectedPassword}
		<div class="flex flex-row items-center gap-1">
			<Input
				bind:value={passwords.selectedPassword!.username}
				readonly={auth.isOfflineMode || !passwords.isEditing}
				type="text"
				placeholder="coolname123"
			/>
			<div>
				<Button
					variant="outline"
					size="icon"
					disabled={!passwords.selectedPassword!.username}
					onclick={async () => {
						await copyText(passwords.selectedPassword!.username!);
					}}
				>
					<Icon icon="lucide:copy" font-size="20" />
				</Button>
			</div>
		</div>
	{/if}
</div>
