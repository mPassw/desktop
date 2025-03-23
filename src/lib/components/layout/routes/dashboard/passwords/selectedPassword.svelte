<script lang="ts">
    import SelectedPasswordButtons from "./selectedPassword/selectedPasswordButtons.svelte";
    import SelectedPasswordTitle from "./selectedPassword/selectedPasswordTitle.svelte";
    import SelectedPasswordUsername from "./selectedPassword/selectedPasswordUsername.svelte";
    import SelectedPasswordPassword from "./selectedPassword/selectedPasswordPassword.svelte";
    import SelectedPasswordNote from "./selectedPassword/selectedPasswordNote.svelte";
    import SelectedPasswordWebsites from "./selectedPassword/selectedPasswordWebsites.svelte";
    import SelectedPasswordTags from "./selectedPassword/selectedPasswordTags.svelte";

    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";
    import { Separator } from "$lib/components/ui/separator";
    import { authState } from "$lib/modules/auth/auth.state.svelte";
    import { KeyRound } from "lucide-svelte";
</script>

{#if passwordsState.selectedPassword}
    <div class="flex flex-col gap-3 w-full h-fit px-2">
        {#if !authState.isOfflineMode}
            <SelectedPasswordButtons />
        {/if}
        <SelectedPasswordTitle />
        <Separator />
        <SelectedPasswordUsername />
        <SelectedPasswordPassword />
        <SelectedPasswordNote />
        <Separator />
        <SelectedPasswordWebsites />
        <SelectedPasswordTags />
        <Separator />
        <div class="flex flex-col gap-1.5">
            <p class="text-xs text-muted-foreground">
                ID: {passwordsState.selectedPassword.id}
            </p>
            <p class="text-xs text-muted-foreground">
                Created: {new Date(
                    passwordsState.selectedPassword.createdAt,
                ).toLocaleString()}
            </p>
            <p class="text-xs text-muted-foreground">
                Updated: {new Date(
                    passwordsState.selectedPassword.updatedAt,
                ).toLocaleString()}
            </p>
        </div>
    </div>
{:else}
    <div class="flex w-full h-full items-center justify-center gap-1.5">
        <KeyRound size={24} />
        <p class="text-center">No password selected</p>
    </div>
{/if}
