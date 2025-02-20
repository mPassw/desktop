<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";

	import Loader from "@/components/animations/loaders/loader.svelte";
	import auth from "@/services/auth.svelte";
	import passwords from "@/services/passwords.svelte";
	import loadersState from "@/services/loaders.svelte";

	import { Button, buttonVariants } from "@/components/ui/button";
	import { toast } from "svelte-sonner";
	import { ArchiveRestore, Pencil, Save, Trash2 } from "lucide-svelte";

	let {
		isPageTrash,
	}: {
		isPageTrash: boolean;
	} = $props();

	let isPermanentlyDeleteDialogOpen: boolean = $state(false);

	const updatePassword = async (): Promise<void> => {
		try {
			loadersState.isLoaderVisible = true;

			if (!passwords.selectedPassword) {
				throw new Error("No password selected");
			}

			await passwords.updatePassword(passwords.selectedPassword);

			toast.success("Password updated");
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			loadersState.isLoaderVisible = false;
		}
	};

	const moveToTrash = async (): Promise<void> => {
		try {
			loadersState.isLoaderVisible = true;

			if (!passwords.selectedPassword) {
				throw new Error("No password selected");
			}

			await passwords.movePasswordToTrash(passwords.selectedPassword);

			toast.success("Password moved to trash");
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			loadersState.isLoaderVisible = false;
		}
	};

	const restore = async (): Promise<void> => {
		try {
			loadersState.isLoaderVisible = true;

			if (!passwords.selectedPassword) {
				throw new Error("No password selected");
			}

			await passwords.restorePassword(passwords.selectedPassword);

			toast.success("Password restored");
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			loadersState.isLoaderVisible = false;
		}
	};

	const permanentlyDelete = async (): Promise<void> => {
		try {
			loadersState.isDialogLoaderVisible = true;

			if (!passwords.selectedPassword) {
				throw new Error("No password selected");
			}

			await passwords.deletePassword(passwords.selectedPassword);

			toast.success("Password permanently deleted");
			isPermanentlyDeleteDialogOpen = false;
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			loadersState.isDialogLoaderVisible = false;
		}
	};
</script>

<div class="flex flex-row gap-1.5 justify-start">
	{#if isPageTrash}
		<Button
			variant="secondary"
			size="sm"
			disabled={auth.isOfflineMode || loadersState.isSomethingLoading}
			onclick={restore}
		>
			<ArchiveRestore size={20} />
			Restore
		</Button>
		<Dialog.Root bind:open={isPermanentlyDeleteDialogOpen}>
			<Dialog.Trigger
				disabled={auth.isOfflineMode || loadersState.isSomethingLoading}
				class={buttonVariants({ variant: "destructive", size: "sm" })}
			>
				<Trash2 size={20} />
				Delete
			</Dialog.Trigger>
			<Dialog.Content
				class="overflow-y-auto min-h-fit max-h-[90%]"
				interactOutsideBehavior={loadersState.isDialogLoaderVisible
					? "ignore"
					: "close"}
				escapeKeydownBehavior={loadersState.isDialogLoaderVisible
					? "ignore"
					: "close"}
			>
				{#if loadersState.isDialogLoaderVisible}
					<Loader dark={true} />
				{/if}
				<Dialog.Header>
					<Dialog.Title>Are you absolutely sure?</Dialog.Title>
					<Dialog.Description>
						This action cannot be undone. This will permanently
						delete this password from the server
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Dialog.Close
						class={buttonVariants({ variant: "secondary" })}
					>
						Cancel
					</Dialog.Close>
					<Button variant="destructive" onclick={permanentlyDelete}>
						Delete
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	{:else if passwords.isEditing}
		<Button
			variant="secondary"
			size="sm"
			disabled={auth.isOfflineMode || loadersState.isSomethingLoading}
			onclick={() => {
				passwords.isEditing = false;
			}}
		>
			<Pencil size={20} />
			Stop Editing
		</Button>
		<Button
			variant="default"
			size="sm"
			disabled={auth.isOfflineMode || loadersState.isSomethingLoading}
			onclick={updatePassword}
		>
			<Save size={20} />
			Save
		</Button>
	{:else}
		<Button
			variant="secondary"
			size="sm"
			disabled={auth.isOfflineMode || loadersState.isSomethingLoading}
			onclick={() => {
				passwords.isEditing = true;
			}}
		>
			<Pencil size={20} />
			Edit
		</Button>
	{/if}

	{#if !isPageTrash}
		<Button
			variant="destructive"
			size="sm"
			disabled={auth.isOfflineMode || loadersState.isSomethingLoading}
			onclick={moveToTrash}
		>
			<Trash2 size={20} />
			Trash
		</Button>
	{/if}
</div>
