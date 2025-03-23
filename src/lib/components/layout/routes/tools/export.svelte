<script lang="ts">
    import * as Tooltip from "$lib/components/ui/tooltip";
    import * as Select from "$lib/components/ui/select";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as path from "@tauri-apps/api/path";

    import { Button, buttonVariants } from "$lib/components/ui/button";
    import { Eye, EyeOff, FileUp, Folder } from "lucide-svelte";
    import { BaseDirectory, exists, mkdir } from "@tauri-apps/plugin-fs";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { openPath } from "@tauri-apps/plugin-opener";
    import { toast } from "svelte-sonner";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { exportService } from "$lib/modules/export/export.service.svelte";
    import { exportState } from "$lib/modules/export/export.state.svelte";
    import { passwordsService } from "$lib/modules/passwords/passwords.service.svelte";

    let isDialogOpen: boolean = $state(false);
    let isMasterPasswordRevealed: boolean = $state(false);

    let masterPassword: string = $state("");

    const openFolder = async () => {
        try {
            if (
                !(await exists("exports", {
                    baseDir: BaseDirectory.AppData,
                }))
            ) {
                await mkdir("exports", {
                    baseDir: BaseDirectory.AppData,
                });
            }
            await openPath((await path.appDataDir()) + "/exports");
        } catch (err: any) {
            toast.error(err.message ?? "Unknown error");
        }
    };

    const _export = async () => {
        try {
            if (masterPassword.length < 8) {
                throw new Error("Invalid master password");
            }

            loadersState.isDialogLoaderVisible = true;

            if (!(await passwordsService.isValidPassword(masterPassword))) {
                throw new Error("Invalid master password");
            }

            await exportService.export();

            isDialogOpen = false;
            toast.success("Passwords exported");
        } catch (err: any) {
            toast.error(err.message ?? "Unknown error");
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };
</script>

<div class="flex flex-col">
    <div class="flex gap-1.5 items-center">
        <p class="text-lg font-semibold tracking-tight">Export</p>
        <Tooltip.Root>
            <Tooltip.Trigger
                class={buttonVariants({ variant: "ghost", size: "mini" })}
                onclick={openFolder}
            >
                <Folder size={14} />
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>Open folder</p>
            </Tooltip.Content>
        </Tooltip.Root>
    </div>
    <div class="flex gap-1.5">
        <Select.Root type="single" bind:value={exportState.exportType}>
            <Select.Trigger class="w-1/3">
                {exportState.exportType === "json" ? "JSON" : "CSV"}
            </Select.Trigger>
            <Select.Content>
                <Select.Item value="json">JSON</Select.Item>
                <Select.Item value="csv">CSV</Select.Item>
            </Select.Content>
        </Select.Root>
        <Dialog.Root
            bind:open={isDialogOpen}
            onOpenChange={() => {
                masterPassword = "";
                isMasterPasswordRevealed = false;
            }}
        >
            <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
                <FileUp size={20} />
                Export
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Description>
                        Export passwords to

                        <code
                            class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
                        >
                            .{exportState.exportType}
                        </code>
                        file <br />
                        Please note: this file will not be encrypted, make sure to
                        keep it safe
                    </Dialog.Description>
                </Dialog.Header>
                <div class="flex flex-col gap-1.5">
                    <Label for="master-password">Master password</Label>
                    <Input
                        bind:value={masterPassword}
                        type={isMasterPasswordRevealed ? "text" : "password"}
                        id="master-password"
                        placeholder="********"
                        icon={isMasterPasswordRevealed ? EyeOff : Eye}
                        onClick={() =>
                            (isMasterPasswordRevealed =
                                !isMasterPasswordRevealed)}
                    />
                </div>
                <Dialog.Footer>
                    <Dialog.Close
                        class={buttonVariants({
                            variant: "outline",
                            size: "sm",
                        })}
                    >
                        Cancel
                    </Dialog.Close>
                    <Button variant="default" size="sm" onclick={_export}>
                        Export
                    </Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
    </div>
</div>
