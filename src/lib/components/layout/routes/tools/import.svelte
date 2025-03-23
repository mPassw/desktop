<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";

    import { Input } from "$lib/components/ui/input";
    import {
        CircleHelp,
        Eye,
        EyeOff,
        Import,
        Trash2,
        Upload,
    } from "lucide-svelte";
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import { listen, type UnlistenFn } from "@tauri-apps/api/event";
    import { readTextFile } from "@tauri-apps/plugin-fs";
    import { onDestroy, onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import { fade } from "svelte/transition";
    import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";
    import { importService } from "$lib/modules/import/import.service.svelte";
    import { importState } from "$lib/modules/import/import.state.svelte";
    import { Label } from "$lib/components/ui/label";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { passwordsService } from "$lib/modules/passwords/passwords.service.svelte";
    import { goto } from "$app/navigation";

    let isDragging: boolean = $state(false);
    let errorMessage: string | null = $state(null);
    let fileName: string = $state("");
    let fileContent: string = $state("");

    let isImportDialogOpen: boolean = $state(false);
    let isMasterPasswordRevealed: boolean = $state(false);
    let masterPassword: string = $state("");

    let listeners: UnlistenFn[] = $state([]);

    const processFileContent = async (content: string, name: string) => {
        try {
            importService.parseData(content);
            fileName = name;
            errorMessage = null;
        } catch (err) {
            console.error(err);
            toast.error("Failed to parse file");
            errorMessage = "Failed to parse file";
        }
    };

    const handleFileChange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (!target?.files?.[0]) return;

        const file = target.files[0];

        if (!file.name.endsWith(".json")) {
            clearSelectedFile();
            errorMessage = "File must be a JSON file";
            fileName = "";
            return;
        }

        try {
            fileContent = await file.text();
            processFileContent(fileContent, file.name);
        } catch (err) {
            console.error(err);
            toast.error("Failed to read file");

            clearSelectedFile();
            errorMessage = "Failed to read file";
        }
    };

    const importPasswords = async () => {
        try {
            loadersState.isDialogLoaderVisible = true;

            if (
                masterPassword.length < 8 ||
                !(await passwordsService.isValidPassword(masterPassword))
            ) {
                throw new Error("Invalid master password");
            }

            await importService.importPasswords(fileContent);

            isImportDialogOpen = false;

            toast.success("Passwords imported");
            await goto("/dashboard/passwords");
        } catch (err: any) {
            toast.error(err.message ?? "Unknown error");
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };

    const clearSelectedFile = () => {
        fileName = "";
        masterPassword = "";
        errorMessage = null;
        importState.parsedTypes = [];
        const input = document.getElementById("file-input") as HTMLInputElement;
        if (input) input.value = "";
    };

    onMount(async () => {
        const dragEnter = await listen("tauri://drag-enter", () => {
            isDragging = true;
        });

        const dragLeave = await listen("tauri://drag-leave", () => {
            isDragging = false;
        });

        const dragDrop = await listen("tauri://drag-drop", async (event) => {
            isDragging = false;

            // @ts-expect-error event is unknown
            const filePath = event.payload.paths[0];
            const pathParts = filePath.split(/[\/\\]/);
            const droppedFileName = pathParts[pathParts.length - 1];

            if (!droppedFileName.endsWith(".json")) {
                clearSelectedFile();
                errorMessage = "File must be a JSON file";
                return;
            }

            try {
                const content = await readTextFile(filePath);
                processFileContent(content, droppedFileName);
            } catch (err) {
                console.error(err);
                toast.error("Failed to read file");

                clearSelectedFile();
                errorMessage = "Failed to read file";
            }
        });

        listeners = [dragEnter, dragLeave, dragDrop];
    });

    onDestroy(() => {
        listeners.forEach((unlisten) => unlisten?.());
        clearSelectedFile();
    });
</script>

<div class="flex flex-col">
    <div class="flex gap-3">
        <p class="text-lg font-semibold tracking-tight">Import</p>
        <Dialog.Root>
            <Dialog.Trigger class="text-muted-foreground">
                <CircleHelp size={14} />
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>
                        Importing passwords from other password managers
                    </Dialog.Title>
                    <Dialog.Description>
                        mPass currently supports importing passwords from the
                        following password managers:
                        <ul class="list-disc list-inside mt-2">
                            <li>mPass (json)</li>
                            <li>Bitwarden (unencrypted json)</li>
                        </ul>
                        <p class="mt-2 text-sm">
                            Additional formats will be supported in future
                            updates.
                        </p>
                    </Dialog.Description>
                </Dialog.Header>
            </Dialog.Content>
        </Dialog.Root>
    </div>

    <div class="flex gap-1.5 items-center h-auto">
        {#if fileName}
            <p>
                Selected file: <span
                    class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
                    >{fileName}</span
                >
            </p>
            <Button size="mini" variant="outline" onclick={clearSelectedFile}>
                <Trash2 size={16} />
            </Button>
        {:else}
            <Input
                id="file-input"
                type="file"
                accept=".json"
                class="w-1/3"
                onchange={handleFileChange}
            />
        {/if}
    </div>

    {#if errorMessage}
        <p class="text-red-500 text-sm mt-2">{errorMessage}</p>
    {/if}

    {#if importState.parsedTypes.length}
        <div class="flex flex-col gap-1.5 mt-1">
            <div class="flex gap-1.5">
                <p>Parsed file type:</p>
                {#each importState.parsedTypes as type}
                    <p
                        class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
                    >
                        {type}
                    </p>
                {/each}
            </div>
            <div>
                <Dialog.Root bind:open={isImportDialogOpen}>
                    <Dialog.Trigger
                        class={buttonVariants({
                            variant: "default",
                            size: "sm",
                        })}
                    >
                        <Import />
                        Import
                    </Dialog.Trigger>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Description>
                                This action will import all passwords from
                                current file
                            </Dialog.Description>
                        </Dialog.Header>
                        <div class="flex flex-col gap-1.5">
                            <Label for="master-password">Master Password</Label>
                            <Input
                                bind:value={masterPassword}
                                type={isMasterPasswordRevealed
                                    ? "text"
                                    : "password"}
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
                            <Button size="sm" onclick={importPasswords}>
                                Import
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Root>
            </div>
        </div>
    {:else if fileName && !errorMessage && !importState.parsedTypes.length}
        <p class="text-red-500 text-sm mt-2">
            No importable data was found in this file. Please ensure you're
            using a supported password manager service for importing your
            credentials
        </p>
    {/if}

    {#if isDragging}
        <div
            transition:fade={{ duration: preferencesState.animationsDuration }}
            class="absolute inset-0 bg-black/50 flex items-center justify-center"
        >
            <div class="flex flex-col items-center gap-1.5">
                <Upload size={32} />
                <p class="text-xl">Drop file here</p>
            </div>
        </div>
    {/if}
</div>
