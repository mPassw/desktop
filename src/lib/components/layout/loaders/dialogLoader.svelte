<script lang="ts">
    import FullScreenLoader from "./fullScreenLoader.svelte";

    import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";
    import { blur } from "svelte/transition";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";

    let {
        width = 128,
        height = 128,
        dark = false,
    }: {
        width?: number;
        height?: number;
        dark?: boolean;
    } = $props();
</script>

<div
    transition:blur={{ duration: preferencesState.animationsDuration }}
    class="flex flex-col justify-center items-center h-full z-[100] absolute inset-0 {dark
        ? 'bg-black/50'
        : ''}"
>
    <FullScreenLoader {width} {height} />
    {#if loadersState.dialogLoaderStatus}
        <p class="tracking-tight font-medium mt-44">
            {loadersState.dialogLoaderStatus}
        </p>
    {/if}
</div>
