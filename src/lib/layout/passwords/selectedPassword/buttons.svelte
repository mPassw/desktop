<script lang="ts">
	import auth from "@/state/auth.svelte";
	import passwords from "@/state/passwords.svelte";
	import Icon from "@iconify/svelte";

	import { Button } from "@/components/ui/button";
	import { toast } from "svelte-sonner";

	let {
		isLoading,
		isPageTrash,
	}: {
		isLoading: boolean;
		isPageTrash: boolean;
	} = $props();

	const updatePassword = async (): Promise<void> => {
		try {
			isLoading = true;

			if (!passwords.selectedPassword) {
				throw new Error("No password selected");
			}

			await passwords.updatePassword(passwords.selectedPassword);
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			isLoading = false;
		}
	};

	const moveToTrash = async (): Promise<void> => {
		try {
			isLoading = true;

			if (!passwords.selectedPassword) {
				throw new Error("No password selected");
			}

			console.log(passwords.selectedPassword);

			await passwords.movePasswordToTrash(passwords.selectedPassword);
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			isLoading = false;
		}
	};

	const restore = async (): Promise<void> => {
		try {
			isLoading = true;

			if (!passwords.selectedPassword) {
				throw new Error("No password selected");
			}

			console.log(passwords.selectedPassword);

			await passwords.restorePassword(passwords.selectedPassword);
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="flex flex-row gap-1.5 justify-start">
	{#if isPageTrash}
		<Button
			variant="secondary"
			size="sm"
			disabled={auth.isOfflineMode || isLoading}
			onclick={restore}
		>
			<Icon icon="lucide:trash-2" font-size="20" />
			Restore
		</Button>
	{:else if passwords.isEditing}
		<Button
			variant="secondary"
			size="sm"
			disabled={auth.isOfflineMode || isLoading}
			onclick={() => {
				passwords.isEditing = false;
			}}
		>
			<Icon icon="lucide:pencil" font-size="20" />
			Stop Editing
		</Button>
		<Button
			variant="default"
			size="sm"
			disabled={auth.isOfflineMode || isLoading}
			onclick={updatePassword}
		>
			<Icon icon="lucide:save" font-size="20" />
			Save
		</Button>
	{:else}
		<Button
			variant="secondary"
			size="sm"
			disabled={auth.isOfflineMode || isLoading}
			onclick={() => {
				passwords.isEditing = true;
			}}
		>
			<Icon icon="lucide:pencil" font-size="20" />
			Edit
		</Button>
	{/if}

	{#if !isPageTrash}
		<Button
			variant="destructive"
			size="sm"
			disabled={auth.isOfflineMode || isLoading}
			onclick={moveToTrash}
		>
			<Icon icon="lucide:trash-2" font-size="20" />
			Trash
		</Button>
	{/if}
</div>
