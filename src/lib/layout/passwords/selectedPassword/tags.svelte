<script lang="ts">
	import auth from "@/state/auth.svelte";
	import passwords from "@/state/passwords.svelte";
	import Icon from "@iconify/svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";

	let {
		newTag = $bindable(),
		copyText,
	}: {
		newTag: string;
		copyText: (text: string) => Promise<void>;
	} = $props();
</script>

<div class="flex flex-col gap-1">
	<h3 class="text-xl">Tags</h3>
	{#each passwords.selectedPassword!.tags as _, index}
		<div class="flex flex-row items-center gap-1">
			<Input
				bind:value={passwords.selectedPassword!.tags[index]}
				readonly={auth.isOfflineMode || !passwords.isEditing}
				type="url"
				maxlength={128}
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
					<Icon icon="lucide:copy" font-size="20" />
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
					<Icon icon="lucide:trash-2" font-size="20" />
				</Button>
			</div>
		</div>
	{/each}
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
				<Icon icon="lucide:plus" font-size="20" />
			</Button>
		</div>
	</div>
</div>
