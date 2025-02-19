<script lang="ts">
	import * as AlertDialog from "$lib/components/ui/alert-dialog";

	import auth from "@/state/auth.svelte";
	import passwords from "@/state/passwords.svelte";
	import Icon from "@iconify/svelte";
	import loadersState from "@/state/loaders.svelte";

	import { Button, buttonVariants } from "@/components/ui/button";
	import { toast } from "svelte-sonner";

	let {
		isPageTrash,
	}: {
		isPageTrash: boolean;
	} = $props();

	const updatePassword = async (): Promise<void> => {
		try {
			loadersState.isPasswordsLoaderVisible = true;

			if (!passwords.selectedPassword) {
				throw new Error("No password selected");
			}

			await passwords.updatePassword(passwords.selectedPassword);

			toast.success("Password updated");
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			loadersState.isPasswordsLoaderVisible = false;
		}
	};

	const moveToTrash = async (): Promise<void> => {
		try {
			loadersState.isPasswordsLoaderVisible = true;

			if (!passwords.selectedPassword) {
				throw new Error("No password selected");
			}

			await passwords.movePasswordToTrash(passwords.selectedPassword);

			toast.success("Password moved to trash");
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			loadersState.isPasswordsLoaderVisible = false;
		}
	};

	const restore = async (): Promise<void> => {
		try {
			loadersState.isPasswordsLoaderVisible = true;

			if (!passwords.selectedPassword) {
				throw new Error("No password selected");
			}

			await passwords.restorePassword(passwords.selectedPassword);

			toast.success("Password restored");
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			loadersState.isPasswordsLoaderVisible = false;
		}
	};

	const permanentlyDelete = async (): Promise<void> => {
		try {
			loadersState.isPasswordsLoaderVisible = true;

			if (!passwords.selectedPassword) {
				throw new Error("No password selected");
			}

			await passwords.deletePassword(passwords.selectedPassword);

			toast.success("Password permanently deleted");
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			loadersState.isPasswordsLoaderVisible = false;
		}
	};
</script>

<div class="flex flex-row gap-1.5 justify-start">
	{#if isPageTrash}
		<Button
			variant="secondary"
			size="sm"
			disabled={auth.isOfflineMode ||
				loadersState.isPasswordsLoaderVisible}
			onclick={restore}
		>
			<Icon icon="lucide:archive-restore" font-size="20" />
			Restore
		</Button>
		<AlertDialog.Root>
			<AlertDialog.Trigger
				disabled={auth.isOfflineMode ||
					loadersState.isPasswordsLoaderVisible}
				class={buttonVariants({ variant: "destructive", size: "sm" })}
			>
				<Icon icon="lucide:trash-2" font-size="20" />
				Delete
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>
						Are you absolutely sure?
					</AlertDialog.Title>
					<AlertDialog.Description>
						This action cannot be undone. This will permanently
						delete this password from the server
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action onclick={permanentlyDelete}>
						Continue
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	{:else if passwords.isEditing}
		<Button
			variant="secondary"
			size="sm"
			disabled={auth.isOfflineMode ||
				loadersState.isPasswordsLoaderVisible}
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
			disabled={auth.isOfflineMode ||
				loadersState.isPasswordsLoaderVisible}
			onclick={updatePassword}
		>
			<Icon icon="lucide:save" font-size="20" />
			Save
		</Button>
	{:else}
		<Button
			variant="secondary"
			size="sm"
			disabled={auth.isOfflineMode ||
				loadersState.isPasswordsLoaderVisible}
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
			disabled={auth.isOfflineMode ||
				loadersState.isPasswordsLoaderVisible}
			onclick={moveToTrash}
		>
			<Icon icon="lucide:trash-2" font-size="20" />
			Trash
		</Button>
	{/if}
</div>
