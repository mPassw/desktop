<script lang="ts">
	import auth from "@/state/auth.svelte";
	import passwords from "@/state/passwords.svelte";
	import Icon from "@iconify/svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Textarea } from "@/components/ui/textarea";
	import { Blurfade } from "@/components/animations/blurfade";
	import { Separator } from "@/components/ui/separator";

	let {
		isDecrypting = $bindable(),
		isLoading,
		isPageTrash,
	}: {
		isDecrypting: boolean;
		isLoading: boolean;
		isPageTrash: boolean;
	} = $props();

	let newWebsite: string = $state("");
</script>

<div class="w-1/2 flex flex-col gap-1.5 overflow-auto h-full pl-2">
	{#if isDecrypting}
		<div class="flex w-full items-center justify-center h-screen">
			<Icon icon="svg-spinners:3-dots-move" font-size="48" />
		</div>
	{:else}
		<Blurfade class="flex flex-col gap-1.5">
			<div class="flex flex-row gap-1.5 justify-start">
				{#if isPageTrash}
					<Button
						variant="secondary"
						size="sm"
						disabled={auth.isOfflineMode || isLoading}
					>
						<Icon icon="lucide:trash-2" font-size="20" />
						Restore
					</Button>
				{:else}
					<Button
						variant="secondary"
						size="sm"
						disabled={auth.isOfflineMode || isLoading}
					>
						<Icon icon="lucide:pencil" font-size="20" />
						Edit
					</Button>
				{/if}

				<Button
					variant="destructive"
					size="sm"
					disabled={auth.isOfflineMode}
				>
					<Icon icon="lucide:trash-2" font-size="20" />
					Trash
				</Button>
			</div>
			<div class="flex flex-col">
				<h3 class="text-xl">Title</h3>
				<Input
					bind:value={passwords.selectedPassword!.title}
					readonly={auth.isOfflineMode || !passwords.isEditing}
					type="text"
					placeholder="My Super Secret Password"
				/>
			</div>
			<div class="flex flex-col">
				<h3 class="text-xl">Username</h3>
				<Input
					bind:value={passwords.selectedPassword!.username!.value}
					readonly={auth.isOfflineMode || !passwords.isEditing}
					type="text"
					placeholder="coolname123"
				/>
			</div>
			<div class="flex flex-col">
				<h3 class="text-xl">Password</h3>
				<Input
					bind:value={passwords.selectedPassword!.password!.value}
					readonly={auth.isOfflineMode || !passwords.isEditing}
					type="text"
					placeholder="********"
				/>
			</div>
			<div class="flex flex-col">
				<h3 class="text-xl">Note</h3>
				<Textarea
					bind:value={passwords.selectedPassword!.note!.value}
					readonly={auth.isOfflineMode || !passwords.isEditing}
					placeholder="Empty..."
				/>
			</div>
			<Separator />
			<div class="flex flex-col">
				<h3 class="text-xl">Websites</h3>
				{#each passwords.selectedPassword!.websites as _, index}
					<Input
						bind:value={passwords.selectedPassword!.websites[index]}
						readonly={auth.isOfflineMode || !passwords.isEditing}
						type="text"
						placeholder="https://example.com"
					/>
				{/each}
				<Input
					bind:value={newWebsite}
					readonly={auth.isOfflineMode || !passwords.isEditing}
					type="text"
					placeholder="https://example.com"
				/>
			</div>
		</Blurfade>
	{/if}
</div>
