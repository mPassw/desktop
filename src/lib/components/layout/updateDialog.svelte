<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { updaterService } from "$lib/modules/updater/updater.service.svelte";

    import { Button, buttonVariants } from "../ui/button";
    import { updaterState } from "$lib/modules/updater/updater.state.svelte";
    import { toast } from "svelte-sonner";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";

    const update = async () => {
        try {
            loadersState.isDialogLoaderVisible = true;

            await updaterService.updateApp();
        } catch (err: any) {
            toast.error(err.message ?? "Unknown error");
        } finally {
            loadersState.isDialogLoaderVisible = false;
            loadersState.dialogLoaderStatus = "";
        }
    };
</script>

<Dialog.Root bind:open={updaterState.isUpdateDialogOpen}>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Update available</Dialog.Title>
            <Dialog.Description>
                Version <span
                    class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
                    >{updaterState.updateData?.version ?? "unknown"}</span
                > is available. Do you want to update now?
            </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
            <Dialog.Close
                class={buttonVariants({ variant: "outline", size: "sm" })}
            >
                Cancel
            </Dialog.Close>
            <Button variant="default" size="sm" onclick={update}>asd</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
