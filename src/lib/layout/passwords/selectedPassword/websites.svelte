<script lang="ts">
	import auth from "@/services/auth.svelte";
	import passwords from "@/services/passwords.svelte";
	import Icon from "@iconify/svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";

	let {
		newWebsite = $bindable(),
		copyText,
		openUrl,
	}: {
		newWebsite: string;
		copyText: (text: string) => Promise<void>;
		openUrl: (url: string) => Promise<void>;
	} = $props();
</script>

<div class="flex flex-col gap-1">
	<h3 class="text-xl">Websites</h3>
	{#each passwords.selectedPassword!.websites as _, index}
		<div class="flex flex-row items-center gap-1">
			<Input
				bind:value={passwords.selectedPassword!.websites[index]}
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
						await openUrl(
							passwords.selectedPassword!.websites[index]
						);
					}}
				>
					<Icon icon="lucide:external-link" font-size="20" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onclick={async () => {
						await copyText(
							passwords.selectedPassword!.websites[index]
						);
					}}
				>
					<Icon icon="lucide:copy" font-size="20" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onclick={() => {
						passwords.selectedPassword!.websites.splice(index, 1);
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
			bind:value={newWebsite}
			readonly={auth.isOfflineMode || !passwords.isEditing}
			type="text"
			maxlength={128}
			placeholder="https://example.com"
		/>
		<div>
			<Button
				variant="outline"
				size="icon"
				disabled={!newWebsite ||
					!passwords.isEditing ||
					auth.isOfflineMode ||
					passwords.selectedPassword!.websites.length >= 10}
				onclick={() => {
					if (newWebsite) {
						passwords.selectedPassword!.websites.push(newWebsite);
						newWebsite = "";
					}
				}}
			>
				<Icon icon="lucide:plus" font-size="20" />
			</Button>
		</div>
	</div>
</div>
