<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";
    import { cn } from "$lib/utils";
    import { Copy, Eye, EyeOff } from "lucide-svelte";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

    let isNoteRevealed: boolean = $state(false);
    let hiddenNote: string = $state("********");

    const copyNote = async () => {
        if (!passwordsState.selectedPassword?.note) return;

        await navigator.clipboard.writeText(
            passwordsState.selectedPassword!.note,
        );

        toast.success("Copied to clipboard");
    };

    const autoResize = (e: any) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    onMount(() => {
        const textarea = document.getElementById("note") as HTMLTextAreaElement;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    });
</script>

<div class="flex w-full flex-col gap-1.5">
    <Label for="note">Note</Label>
    <div
        class={cn(
            "group flex gap-1.5 flex-col items-start border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 h-fit min-h-10 w-full rounded-md border px-3 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative",
        )}
    >
        {#if isNoteRevealed}
            <textarea
                bind:value={passwordsState.selectedPassword!.note}
                id="note"
                placeholder="Empty"
                readonly={!passwordsState.isInEditMode}
                oninput={autoResize}
                class="w-full bg-transparent border-none outline-none p-0 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted-foreground resize-none"
            >
            </textarea>
        {:else}
            <textarea
                bind:value={hiddenNote}
                id="note"
                placeholder="Empty"
                readonly
                class="w-full text-muted-foreground bg-transparent border-none outline-none p-0 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted-foreground resize-none"
            >
            </textarea>
        {/if}

        <div class="flex gap-1.5">
            <Button
                variant="outline"
                size="input"
                onclick={copyNote}
                disabled={!passwordsState.selectedPassword?.note}
            >
                <Copy size={16} />
                Copy
            </Button>
            <Button
                variant="outline"
                size="input"
                onclick={() => (isNoteRevealed = !isNoteRevealed)}
                disabled={!passwordsState.selectedPassword?.note}
            >
                {#if isNoteRevealed}
                    <EyeOff size={16} />
                    Hide
                {:else}
                    <Eye size={16} />
                    Reveal
                {/if}
            </Button>
        </div>
    </div>
</div>
