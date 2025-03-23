<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet";

    import { Button } from "$lib/components/ui/button";
    import { InputWithButtons } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";
    import {
        ClipboardPaste,
        ExternalLink,
        Eye,
        EyeOff,
        Minus,
        Plus,
        RefreshCw,
    } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { cn } from "$lib/utils";
    import { generatorService } from "$lib/modules/generator/generator.service.svelte";
    import { passwordsService } from "$lib/modules/passwords/passwords.service.svelte";
    import { openUrl } from "@tauri-apps/plugin-opener";

    let isUsernameRevealed: boolean = $state(false);
    let isPasswordRevealed: boolean = $state(false);

    let newWebsite: string = $state("");
    let newTag: string = $state("");

    const pasteTitle = async () =>
        (passwordsState.newPassword.title =
            await navigator.clipboard.readText());

    const pasteUsername = async () =>
        (passwordsState.newPassword.username =
            await navigator.clipboard.readText());

    const pastePassword = async () =>
        (passwordsState.newPassword.password =
            await navigator.clipboard.readText());

    const pasteNote = async () =>
        (passwordsState.newPassword.note =
            await navigator.clipboard.readText());

    const generateUsername = async () =>
        (passwordsState.newPassword.username =
            await generatorService.generateUsername());

    const generatePassword = async () =>
        (passwordsState.newPassword.password =
            await generatorService.generatePassword());

    const openWebsite = async (url: string) => {
        try {
            const httpRegex = /^https?:\/\//i;
            if (!httpRegex.test(url)) {
                url = `https://${url}`;
            }
            await openUrl(url);
        } catch (err: any) {
            toast.error(err.message ?? "Unknown error");
        }
    };

    const addPassword = async () => {
        try {
            loadersState.isDialogLoaderVisible = true;

            // trim everything
            passwordsState.newPassword.title =
                passwordsState.newPassword.title.trim();
            passwordsState.newPassword.username =
                passwordsState.newPassword.username.trim();
            passwordsState.newPassword.password =
                passwordsState.newPassword.password.trim();
            passwordsState.newPassword.note =
                passwordsState.newPassword.note.trim();
            passwordsState.newPassword.websites =
                passwordsState.newPassword.websites.map((w) => w.trim());
            passwordsState.newPassword.tags =
                passwordsState.newPassword.tags.map((t) => t.trim());

            if (!passwordsState.newPassword.title) {
                if (!passwordsState.newPassword.websites.length) {
                    throw new Error("Title is required");
                }

                passwordsState.newPassword.title =
                    passwordsState.newPassword.websites[0].replace(
                        /^https?:\/\//i,
                        "",
                    );
            }

            if (
                !passwordsState.newPassword.username.length &&
                !passwordsState.newPassword.password.length &&
                !passwordsState.newPassword.note.length
            ) {
                throw new Error("At least one field is required");
            }

            await passwordsService.addPassword(passwordsState.newPassword);

            passwordsState.newPassword = {
                title: "",
                username: "",
                password: "",
                note: "",
                websites: [],
                tags: [],
            };

            passwordsState.isNewPasswordDialogOpen = false;

            toast.success("Password added successfully");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };
</script>

<Sheet.Root bind:open={passwordsState.isNewPasswordDialogOpen}>
    <Sheet.Content class="">
        <ScrollArea class="h-full">
            <div class="flex flex-col gap-3 w-full p-1 pr-3">
                <div class="flex w-full flex-col gap-1.5">
                    <Label for="new-password-title">Title</Label>
                    <InputWithButtons
                        bind:value={passwordsState.newPassword.title}
                        id="new-password-title"
                        type="text"
                        placeholder="My Secret Password"
                    >
                        <Button
                            variant="outline"
                            size="input"
                            onclick={pasteTitle}
                        >
                            <ClipboardPaste size={16} />
                            Paste
                        </Button>
                    </InputWithButtons>
                </div>
                <div class="flex w-full flex-col gap-1.5">
                    <Label for="new-password-username">Username</Label>
                    <InputWithButtons
                        bind:value={passwordsState.newPassword.username}
                        id="new-password-username"
                        type={isUsernameRevealed ? "email" : "password"}
                        placeholder="coolname69420"
                    >
                        <Button
                            variant="outline"
                            size="input"
                            onclick={() =>
                                (isUsernameRevealed = !isUsernameRevealed)}
                        >
                            {#if isUsernameRevealed}
                                <EyeOff size={16} />
                                Hide
                            {:else}
                                <Eye size={16} />
                                Reveal
                            {/if}
                        </Button>
                        <Button
                            variant="outline"
                            size="input"
                            onclick={generateUsername}
                        >
                            <RefreshCw size={16} />
                            Generate
                        </Button>
                        <Button
                            variant="outline"
                            size="input"
                            onclick={pasteUsername}
                        >
                            <ClipboardPaste size={16} />
                            Paste
                        </Button>
                    </InputWithButtons>
                </div>
                <div class="flex w-full flex-col gap-1.5">
                    <Label for="new-password-password">Password</Label>
                    <InputWithButtons
                        bind:value={passwordsState.newPassword.password}
                        id="new-password-password"
                        type={isPasswordRevealed ? "text" : "password"}
                        placeholder="********"
                    >
                        <Button
                            variant="outline"
                            size="input"
                            onclick={() =>
                                (isPasswordRevealed = !isPasswordRevealed)}
                        >
                            {#if isPasswordRevealed}
                                <EyeOff size={16} />
                                Hide
                            {:else}
                                <Eye size={16} />
                                Reveal
                            {/if}
                        </Button>
                        <Button
                            variant="outline"
                            size="input"
                            onclick={generatePassword}
                        >
                            <RefreshCw size={16} />
                            Generate
                        </Button>
                        <Button
                            variant="outline"
                            size="input"
                            onclick={pastePassword}
                        >
                            <ClipboardPaste size={16} />
                            Paste
                        </Button>
                    </InputWithButtons>
                </div>
                <div class="flex w-full flex-col gap-1.5">
                    <Label for="new-password-note">Note</Label>
                    <div
                        class={cn(
                            "group flex gap-1.5 flex-col items-start border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 h-fit min-h-10 w-full rounded-md border px-3 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative",
                        )}
                    >
                        <textarea
                            bind:value={passwordsState.newPassword.note}
                            id="new-password-note"
                            placeholder="Empty"
                            class="w-full bg-transparent border-none outline-none p-0 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted-foreground resize-none"
                        >
                        </textarea>
                        <div class="flex gap-1.5">
                            <Button
                                variant="outline"
                                size="input"
                                onclick={pasteNote}
                            >
                                <ClipboardPaste size={16} />
                                Paste
                            </Button>
                        </div>
                    </div>
                </div>
                <div class="flex w-full flex-col gap-1.5">
                    <Label for="new-password-websites">Websites</Label>
                    {#each passwordsState.newPassword.websites as website, index}
                        <InputWithButtons
                            bind:value={
                                passwordsState.newPassword.websites[index]
                            }
                            id="new-password-website-{index}"
                            type="url"
                            placeholder="example.com"
                        >
                            <Button
                                variant="outline"
                                size="input"
                                onclick={async () => await openWebsite(website)}
                            >
                                <ExternalLink size={16} />
                                Open
                            </Button>
                            <Button
                                variant="outline"
                                size="input"
                                onclick={() => {
                                    passwordsState.newPassword.websites =
                                        passwordsState.newPassword.websites.filter(
                                            (w) => w !== website,
                                        );
                                }}
                            >
                                <Minus size={16} />
                                Remove
                            </Button>
                        </InputWithButtons>
                    {/each}
                    <InputWithButtons
                        bind:value={newWebsite}
                        id="new-password-websites"
                        type="url"
                        placeholder="example.com"
                    >
                        <Button
                            variant="outline"
                            size="input"
                            onclick={() => {
                                passwordsState.newPassword.websites.push(
                                    newWebsite,
                                );
                                newWebsite = "";
                            }}
                            disabled={!newWebsite ||
                                passwordsState.newPassword.websites.length >=
                                    10}
                        >
                            <Plus size={16} />
                            Add
                        </Button>
                    </InputWithButtons>
                </div>
                <div class="flex w-full flex-col gap-1.5">
                    <Label for="new-password-tags">Tags</Label>
                    {#each passwordsState.newPassword.tags as tag, index}
                        <InputWithButtons
                            bind:value={passwordsState.newPassword.tags[index]}
                            id="new-password-tag-{index}"
                            type="text"
                            placeholder="Social Media"
                        >
                            <Button
                                variant="outline"
                                size="input"
                                onclick={() => {
                                    passwordsState.newPassword.tags =
                                        passwordsState.newPassword.tags.filter(
                                            (t) => t !== tag,
                                        );
                                }}
                            >
                                <Minus size={16} />
                                Remove
                            </Button>
                        </InputWithButtons>
                    {/each}
                    <InputWithButtons
                        bind:value={newTag}
                        id="new-password-tags"
                        type="text"
                        placeholder="Social Media"
                    >
                        <Button
                            variant="outline"
                            size="input"
                            onclick={() => {
                                passwordsState.newPassword.tags.push(newTag);
                                newTag = "";
                            }}
                            disabled={!newTag ||
                                passwordsState.newPassword.tags.length >= 10}
                        >
                            <Plus size={16} />
                            Add
                        </Button>
                    </InputWithButtons>
                </div>
            </div>
            <Sheet.Footer class="pr-3 mt-2">
                <Button size="sm" onclick={addPassword}>
                    <Plus size={16} />
                    Add
                </Button>
            </Sheet.Footer>
        </ScrollArea>
    </Sheet.Content>
</Sheet.Root>
