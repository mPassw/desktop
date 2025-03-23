<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";
    import { cn } from "$lib/utils";
    import { Copy } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    const copyTitle = async () => {
        await navigator.clipboard.writeText(
            passwordsState.selectedPassword!.title,
        );

        toast.success("Copied to clipboard");
    };
</script>

<div class="flex w-full flex-col gap-1.5">
    <Label for="title">Title</Label>
    <div
        class={cn(
            "group flex gap-1.5 flex-col items-start border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 h-fit min-h-10 w-full rounded-md border px-3 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative",
        )}
    >
        <input
            bind:value={passwordsState.selectedPassword!.title}
            type="text"
            id="title"
            placeholder="My secret password"
            readonly={!passwordsState.isInEditMode}
            class="w-full bg-transparent border-none outline-none p-0 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted-foreground"
        />
        <Button variant="outline" size="input" onclick={copyTitle}>
            <Copy size={16} />
            Copy
        </Button>
    </div>
</div>
