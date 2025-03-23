<script lang="ts">
    import { generatorService } from "$lib/modules/generator/generator.service.svelte";
    import { generatorState } from "$lib/modules/generator/generator.state.svelte";
    import { Copy } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatorState.generated);
            toast.success("Copied to clipboard");
        } catch (err: any) {
            toast.error("Failed to copy");
        }
    };
</script>

<button
    onclick={copyToClipboard}
    class="w-full flex flex-row flex-wrap items-center justify-center border border-input rounded-md p-4 hover:bg-accent/50 relative"
>
    {#each generatorState.generated.split("") as char}
        {#if generatorService.NUMBERSET.includes(char)}
            <span class="text-blue-500">{char}</span>
        {:else if generatorService.SPECIALSET.includes(char)}
            <span class="text-red-500">{char}</span>
        {:else}
            <span>{char}</span>
        {/if}
    {/each}
    <Copy size={16} class="absolute top-2 right-2 text-muted-foreground" />
</button>
