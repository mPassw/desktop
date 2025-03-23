<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { generatorService } from "$lib/modules/generator/generator.service.svelte";
    import { generatorState } from "$lib/modules/generator/generator.state.svelte";
    import { Copy, Trash2 } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    let hoveredIndex: number | null = $state(null);

    const setHoveredIndex = async (index: number | null) => {
        if (index !== null) {
            await generatorService.decryptHistoryItem(
                generatorState.history[index],
            );
        }

        hoveredIndex = index;
    };

    const copyToClipboard = async (index: number) => {
        try {
            await navigator.clipboard.writeText(
                generatorState.history[index].value,
            );
            toast.success("Copied to clipboard");
        } catch (err: any) {
            toast.error("Failed to copy");
        }
    };

    const clearHistory = async () => {
        try {
            await generatorService.clearHistory();
            toast.success("History cleared");
        } catch (err: any) {
            toast.error("Failed to clear history");
        }
    };
</script>

<div class="flex flex-col gap-1.5 w-full">
    <div class="flex w-full justify-between">
        <p class="text-lg font-semibold tracking-tight">
            History <span class="text-sm text-muted-foreground font-normal">
                (hover to reveal)
            </span>
        </p>
        <Button variant="ghost" size="mini" onclick={clearHistory}>
            <Trash2 size={18} />
            Clear
        </Button>
    </div>
    {#each generatorState.history as historyItem, index}
        <button
            onmouseenter={() => setHoveredIndex(index)}
            onmouseleave={() => (hoveredIndex = null)}
            onclick={() => copyToClipboard(index)}
            class="flex flex-col w-full h-16 gap-1 border border-input rounded-md p-2 text-start hover:bg-accent/50 relative"
        >
            <p class="truncate w-[98%]">
                {hoveredIndex === index ? historyItem.value : "**********"}
            </p>
            <p class="text-xs text-muted-foreground">{historyItem.type}</p>
            {#if hoveredIndex === index}
                <Copy
                    size={16}
                    class="absolute top-3 right-2 text-muted-foreground"
                />
            {/if}
        </button>
    {/each}
</div>
