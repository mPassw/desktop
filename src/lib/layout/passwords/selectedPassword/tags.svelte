<script lang="ts">
	import auth from "@/services/auth.svelte";
	import passwords from "@/services/passwords.svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Copy, Plus, Trash2 } from "lucide-svelte";

	let {
		newTag = $bindable(),
		copyText,
	}: {
		newTag: string;
		copyText: (text: string) => Promise<void>;
	} = $props();
</script>

<div class="flex flex-col gap-1">
	<div class="flex flex-col">
		<h3 class="text-xl">Tags</h3>
		{#if passwords.selectedPassword!.tags.length === 0}
			<p class="text-muted-foreground">Empty</p>
		{/if}
	</div>
	{#each passwords.selectedPassword!.tags as _, index}
		<div class="flex flex-row items-center gap-1">
			<Input
				bind:value={passwords.selectedPassword!.tags[index]}
				readonly={auth.isOfflineMode || !passwords.isEditing}
				type="url"
				maxlength={32}
				placeholder="https://example.com"
			/>
			<div class="flex flex-row gap-1">
				<Button
					variant="outline"
					size="icon"
					onclick={async () => {
						await copyText(passwords.selectedPassword!.tags[index]);
					}}
				>
					<Copy size={20} />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onclick={() => {
						passwords.selectedPassword!.tags.splice(index, 1);
					}}
					class={auth.isOfflineMode || !passwords.isEditing
						? "hidden"
						: ""}
				>
					<Trash2 size={20} />
				</Button>
			</div>
		</div>
	{/each}
	{#if passwords.isEditing}
		<div class="flex flex-row items-center gap-1">
			<Input
				bind:value={newTag}
				readonly={auth.isOfflineMode || !passwords.isEditing}
				type="text"
				maxlength={32}
				placeholder="Social Media"
			/>
			<div>
				<Button
					variant="outline"
					size="icon"
					disabled={!newTag ||
						!passwords.isEditing ||
						auth.isOfflineMode ||
						passwords.selectedPassword!.tags.length >= 10}
					onclick={() => {
						if (newTag) {
							passwords.selectedPassword!.tags.push(newTag);
							newTag = "";
						}
					}}
				>
					<Plus size={20} />
				</Button>
			</div>
		</div>
	{/if}
</div>
