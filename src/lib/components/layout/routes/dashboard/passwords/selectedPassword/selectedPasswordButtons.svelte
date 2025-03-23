<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";

    import { page } from "$app/state";
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { passwordsService } from "$lib/modules/passwords/passwords.service.svelte";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";
    import { Pencil, Save, Trash2, Undo2, X } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    let isPageTrash: boolean = $derived(
        page.url.pathname === "/dashboard/trash",
    );

    const save = async () => {
        try {
            if (!passwordsState.selectedPassword) {
                throw new Error("No password selected");
            }

            loadersState.isFullscreenLoaderVisible = true;

            await passwordsService.updatePassword(
                passwordsState.selectedPassword,
                true,
            );

            toast.success("Password updated");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            loadersState.isFullscreenLoaderVisible = false;
        }
    };

    const toTrash = async () => {
        try {
            if (!passwordsState.selectedPassword) {
                throw new Error("No password selected");
            }

            loadersState.isFullscreenLoaderVisible = true;

            await passwordsService.movePasswordToTrash(
                passwordsState.selectedPassword,
            );

            toast.success("Moved to trash");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            loadersState.isFullscreenLoaderVisible = false;
        }
    };

    const restore = async () => {
        try {
            if (!passwordsState.selectedPassword) {
                throw new Error("No password selected");
            }

            loadersState.isFullscreenLoaderVisible = true;

            await passwordsService.restorePassword(
                passwordsState.selectedPassword,
            );

            toast.success("Restored");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            loadersState.isFullscreenLoaderVisible = false;
        }
    };

    const permaDelete = async () => {
        try {
            if (!passwordsState.selectedPassword) {
                throw new Error("No password selected");
            }

            loadersState.isDialogLoaderVisible = true;

            await passwordsService.deletePassword(
                passwordsState.selectedPassword,
            );

            toast.success("Deleted");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };
</script>

<div class="flex w-full justify-start items-center gap-1.5">
    {#if !isPageTrash}
        {#if passwordsState.isInEditMode}
            <Button
                variant="secondary"
                size="sm"
                onclick={async () => await save()}
            >
                <Save size={18} />
                Save
            </Button>
        {:else}
            <Button
                variant="secondary"
                size="sm"
                onclick={() =>
                    (passwordsState.isInEditMode =
                        !passwordsState.isInEditMode)}
            >
                <Pencil size={18} />
                Edit
            </Button>
        {/if}
    {/if}

    {#if isPageTrash}
        <Dialog.Root>
            <Dialog.Trigger
                class={buttonVariants({ variant: "destructive", size: "sm" })}
            >
                <X size={18} />
                Delete
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
                    <Dialog.Description>
                        This will delete the password permanently
                    </Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer>
                    <Dialog.Close>
                        <Button variant="secondary" size="sm">Cancel</Button>
                    </Dialog.Close>
                    <Button
                        variant="destructive"
                        size="sm"
                        onclick={async () => await permaDelete()}
                    >
                        Delete
                    </Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
        <Button
            variant="secondary"
            size="sm"
            onclick={async () => await restore()}
        >
            <Undo2 size={18} />
            Restore
        </Button>
    {:else}
        <Button
            variant="destructive"
            size="sm"
            onclick={async () => await toTrash()}
        >
            <Trash2 size={18} />
            Trash
        </Button>
    {/if}
</div>
