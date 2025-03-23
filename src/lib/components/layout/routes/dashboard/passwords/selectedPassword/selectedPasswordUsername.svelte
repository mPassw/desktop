<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import { generatorService } from "$lib/modules/generator/generator.service.svelte";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";
    import { cn } from "$lib/utils";
    import { Copy, Eye, EyeOff, KeyRound } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    let isUsernameRevealed: boolean = $state(false);
    let hiddenUsername: string = $state("********");

    const copyUsername = async () => {
        if (!passwordsState.selectedPassword?.username) return;

        await navigator.clipboard.writeText(
            passwordsState.selectedPassword!.username,
        );

        toast.success("Copied to clipboard");
    };

    const generateUsername = async () =>
        (passwordsState.selectedPassword!.username =
            await generatorService.generateUsername());
</script>

<div class="flex w-full flex-col gap-1.5">
    <Label for="username">Username</Label>
    <div
        class={cn(
            "group flex gap-1.5 flex-col items-start border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 h-fit min-h-10 w-full rounded-md border px-3 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative",
        )}
    >
        {#if isUsernameRevealed}
            <input
                bind:value={passwordsState.selectedPassword!.username}
                type="text"
                id="username"
                placeholder="coolname69420"
                readonly={!passwordsState.isInEditMode}
                class="w-full bg-transparent border-none outline-none p-0 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted-foreground"
            />
        {:else}
            <input
                bind:value={hiddenUsername}
                type="text"
                id="username"
                placeholder="coolname69420"
                readonly
                class="w-full text-muted-foreground bg-transparent border-none outline-none p-0 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted-foreground"
            />
        {/if}
        <div class="flex gap-1.5">
            <Button
                variant="outline"
                size="input"
                onclick={copyUsername}
                disabled={!passwordsState.selectedPassword?.username}
            >
                <Copy size={16} />
                Copy
            </Button>
            <Button
                variant="outline"
                size="input"
                onclick={() => (isUsernameRevealed = !isUsernameRevealed)}
                disabled={!passwordsState.selectedPassword?.username}
            >
                {#if isUsernameRevealed}
                    <EyeOff size={16} />
                    Hide
                {:else}
                    <Eye size={16} />
                    Reveal
                {/if}
            </Button>
            {#if passwordsState.isInEditMode}
                <Button
                    variant="outline"
                    size="input"
                    onclick={generateUsername}
                    disabled={!passwordsState.selectedPassword?.username}
                >
                    <KeyRound size={16} />
                    Generate
                </Button>
            {/if}
        </div>
    </div>
</div>
