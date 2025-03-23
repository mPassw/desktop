<script lang="ts">
    import GeneratedPassword from "$lib/components/layout/routes/dashboard/generator/generatedPassword.svelte";
    import GeneratorAddressedEmail from "$lib/components/layout/routes/dashboard/generator/generatorAddressedEmail.svelte";
    import GeneratorPassphraseSettings from "$lib/components/layout/routes/dashboard/generator/generatorPassphraseSettings.svelte";
    import GeneratorPasswordSettings from "$lib/components/layout/routes/dashboard/generator/generatorPasswordSettings.svelte";
    import GeneratorRandomWord from "$lib/components/layout/routes/dashboard/generator/generatorRandomWord.svelte";
    import GeneratorType from "$lib/components/layout/routes/dashboard/generator/generatorType.svelte";
    import History from "$lib/components/layout/routes/dashboard/generator/history.svelte";

    import { Button } from "$lib/components/ui/button";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import { Separator } from "$lib/components/ui/separator";
    import { RefreshCw } from "lucide-svelte";
    import { authState } from "$lib/modules/auth/auth.state.svelte";
    import { generatorService } from "$lib/modules/generator/generator.service.svelte";
    import { generatorState } from "$lib/modules/generator/generator.state.svelte";
    import { onDestroy, onMount } from "svelte";
    import { toast } from "svelte-sonner";

    const generate = async () => {
        try {
            await generatorService.generate();
        } catch (err: any) {
            toast.error(err.message ?? "Unknown error");
        }
    };

    onMount(async () => {
        if (!generatorState.addressedEmailAddress.length) {
            generatorState.addressedEmailAddress = authState.user?.email ?? "";
        }

        await generatorService.loadHistory();
        await generatorService.generate();
    });

    onDestroy(() => {
        generatorState.generated = "";
        generatorState.history = [];
    });
</script>

<ScrollArea class=" h-full">
    <div class="flex flex-col gap-1.5 p-2">
        <GeneratedPassword />
        <GeneratorType />
        <Separator class="my-1" />
        {#if generatorState.type === "password"}
            {#if generatorState.passwordType === "password"}
                <GeneratorPasswordSettings />
            {:else if generatorState.passwordType === "passphrase"}
                <GeneratorPassphraseSettings />
            {/if}
        {:else if generatorState.type === "username"}
            {#if generatorState.usernameType === "addressedEmail"}
                <GeneratorAddressedEmail />
            {:else if generatorState.usernameType === "randomWord"}
                <GeneratorRandomWord />
            {/if}
        {/if}
        <Button size="sm" onclick={generate} class="mt-3 w-fit">
            <RefreshCw size={18} />
            Generate
        </Button>
        <Separator class="my-1" />
        <History />
    </div>
</ScrollArea>
