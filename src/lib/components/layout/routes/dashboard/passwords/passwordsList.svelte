<script lang="ts">
    import PasswordCard from "./passwordCard.svelte";

    import type { Password } from "$lib/modules/passwords/passwords.types.svelte";
    import { page } from "$app/state";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { ListX } from "lucide-svelte";
    import { onDestroy, onMount } from "svelte";
    import { passwordsService } from "$lib/modules/passwords/passwords.service.svelte";

    let isTrashPage: boolean = $derived(
        page.url.pathname === "/dashboard/trash",
    );
    let filteredPasswords: Password[] = $derived(
        passwordsState.passwords.filter(
            (password) => password.inTrash === isTrashPage,
        ),
    );

    onMount(async () => {
        const firstPassword = filteredPasswords[0];

        if (firstPassword) {
            await passwordsService.setSelectedPassword(firstPassword);
        } else {
            passwordsState.selectedPassword = null;
        }
    });

    onDestroy(() => {
        passwordsState.selectedPassword = null;
    });
</script>

<div class="flex flex-col w-full h-full">
    {#if !loadersState.isFullscreenLoaderVisible && !filteredPasswords.length}
        <div class="flex w-full h-full items-center justify-center">
            <ListX />
            <p class="text-center">No passwords found</p>
        </div>
    {/if}
    {#each filteredPasswords as password}
        <PasswordCard {password} />
    {/each}
</div>
