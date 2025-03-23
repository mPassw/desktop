<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";
    import { cn } from "$lib/utils";
    import { openUrl } from "@tauri-apps/plugin-opener";
    import { Copy, ExternalLink, Minus, Plus } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    let newWebsite: string = $state("");

    const copyWebsite = async (url: string) => {
        await navigator.clipboard.writeText(url);

        toast.success("Copied to clipboard");
    };

    const openWebsite = async (url: string) => {
        try {
            const httpRegex = /^https?:\/\//i;
            if (!httpRegex.test(url)) {
                url = `https://${url}`;
            }
            await openUrl(url);
        } catch (err: any) {
            toast.error(err.message);
        }
    };
</script>

<div class="flex w-full flex-col gap-1.5">
    <Label for="websites"
        >Websites <span class="text-xs text-muted-foreground">(services)</span
        ></Label
    >
    {#if passwordsState.selectedPassword?.websites.length}
        {#each passwordsState.selectedPassword!.websites as website, index}
            <div
                class={cn(
                    "group flex gap-1.5 flex-col items-start border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 h-fit min-h-10 w-full rounded-md border px-3 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative",
                )}
            >
                <input
                    bind:value={
                        passwordsState.selectedPassword!.websites[index]
                    }
                    type="url"
                    id="website"
                    placeholder="https://example.com"
                    readonly={!passwordsState.isInEditMode}
                    class="w-full bg-transparent border-none outline-none p-0 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted-foreground"
                />
                <div class="flex items-center gap-1.5">
                    <Button
                        variant="outline"
                        size="input"
                        disabled={!website.length}
                        onclick={async () => await copyWebsite(website)}
                    >
                        <Copy size={16} />
                        Copy
                    </Button>
                    <Button
                        variant="outline"
                        size="input"
                        disabled={!website.length}
                        onclick={async () => await openWebsite(website)}
                    >
                        <ExternalLink size={16} />
                        Open
                    </Button>
                    {#if passwordsState.isInEditMode}
                        <Button
                            variant="outline"
                            size="input"
                            disabled={!website.length}
                            onclick={async () => {
                                passwordsState.selectedPassword!.websites.splice(
                                    index,
                                    1,
                                );
                            }}
                        >
                            <Minus size={16} />
                            Remove
                        </Button>
                    {/if}
                </div>
            </div>
        {/each}
    {:else}
        <p class="text-muted-foreground text-sm">Empty</p>
    {/if}
    {#if passwordsState.isInEditMode}
        <div
            class={cn(
                "group flex gap-1.5 flex-col items-start border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 h-fit min-h-10 w-full rounded-md border px-3 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative",
            )}
        >
            <input
                bind:value={newWebsite}
                type="url"
                id="website"
                placeholder="https://example.com"
                readonly={!passwordsState.isInEditMode}
                class="w-full bg-transparent border-none outline-none p-0 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted-foreground"
            />
            <div class="flex items-center gap-1.5">
                <Button
                    variant="outline"
                    size="input"
                    disabled={!newWebsite.length ||
                        passwordsState.selectedPassword!.websites.length >= 10}
                    onclick={() => {
                        passwordsState.selectedPassword!.websites.push(
                            newWebsite,
                        );
                        newWebsite = "";
                    }}
                >
                    <Plus size={16} />
                    Add
                </Button>
            </div>
        </div>
    {/if}
</div>
