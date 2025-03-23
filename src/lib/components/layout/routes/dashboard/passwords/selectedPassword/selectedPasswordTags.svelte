<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";
    import { cn } from "$lib/utils";
    import { Copy, Minus, Plus } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    let newTag: string = $state("");

    const copyTag = async (text: string) => {
        await navigator.clipboard.writeText(text);

        toast.success("Copied to clipboard");
    };
</script>

<div class="flex w-full flex-col gap-1.5">
    <Label for="tags">Tags</Label>
    {#if passwordsState.selectedPassword?.tags.length}
        {#each passwordsState.selectedPassword!.tags as tag, index}
            <div
                class={cn(
                    "group flex gap-1.5 flex-col items-start border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 h-fit min-h-10 w-full rounded-md border px-3 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative",
                )}
            >
                <input
                    bind:value={passwordsState.selectedPassword!.tags[index]}
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
                        disabled={!tag.length}
                        onclick={async () => await copyTag(tag)}
                    >
                        <Copy size={16} />
                        Copy
                    </Button>
                    {#if passwordsState.isInEditMode}
                        <Button
                            variant="outline"
                            size="input"
                            disabled={!tag.length}
                            onclick={async () => {
                                passwordsState.selectedPassword!.tags.splice(
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
                bind:value={newTag}
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
                    disabled={!newTag.length ||
                        passwordsState.selectedPassword!.tags.length >= 10}
                    onclick={() => {
                        passwordsState.selectedPassword!.tags.push(newTag);
                        newTag = "";
                    }}
                >
                    <Plus size={16} />
                    Add
                </Button>
            </div>
        </div>
    {/if}
</div>
