<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import { generatorService } from "$lib/modules/generator/generator.service.svelte";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";
    import { cn } from "$lib/utils";
    import { Copy, Eye, EyeOff, KeyRound } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    let isPasswordRevealed: boolean = $state(false);
    let hiddenPassword: string = $state("********");

    const copyPassword = async () => {
        if (!passwordsState.selectedPassword?.password) return;

        await navigator.clipboard.writeText(
            passwordsState.selectedPassword!.password,
        );

        toast.success("Copied to clipboard");
    };

    const generatePassword = async () =>
        (passwordsState.selectedPassword!.password =
            await generatorService.generatePassword());
</script>

<div class="flex w-full flex-col gap-1.5">
    <Label for="password">Password</Label>
    <div
        class={cn(
            "group flex gap-1.5 flex-col items-start border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 h-fit min-h-10 w-full rounded-md border px-3 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative",
        )}
    >
        {#if isPasswordRevealed}
            <input
                bind:value={passwordsState.selectedPassword!.password}
                type="text"
                id="password"
                placeholder="********"
                readonly={!passwordsState.isInEditMode}
                class="w-full bg-transparent border-none outline-none p-0 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted-foreground"
            />
        {:else}
            <input
                bind:value={hiddenPassword}
                type="text"
                id="password"
                placeholder="********"
                readonly
                class="w-full text-muted-foreground bg-transparent border-none outline-none p-0 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted-foreground"
            />
        {/if}

        <div class="flex items-center gap-1.5">
            <Button
                variant="outline"
                size="input"
                onclick={copyPassword}
                disabled={!passwordsState.selectedPassword?.password}
            >
                <Copy size={16} />
                Copy
            </Button>
            <Button
                variant="outline"
                size="input"
                onclick={() => (isPasswordRevealed = !isPasswordRevealed)}
                disabled={!passwordsState.selectedPassword?.password}
            >
                {#if isPasswordRevealed}
                    <EyeOff size={16} />
                {:else}
                    <Eye size={16} />
                {/if}
                {isPasswordRevealed ? "Hide" : "Reveal"}
            </Button>
            {#if passwordsState.isInEditMode}
                <Button
                    variant="outline"
                    size="input"
                    onclick={generatePassword}
                    disabled={!passwordsState.selectedPassword?.password}
                >
                    <KeyRound size={16} />
                    Generate
                </Button>
            {/if}
        </div>
    </div>
</div>
