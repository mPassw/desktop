<script lang="ts">
    import Sidebar from "$lib/components/layout/routes/dashboard/sidebar.svelte";
    import Header from "$lib/components/layout/routes/dashboard/header.svelte";
    import Search from "$lib/components/layout/routes/dashboard/search.svelte";
    import NewPassword from "$lib/components/layout/routes/dashboard/newPassword.svelte";

    import { authState } from "$lib/modules/auth/auth.state.svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";
    import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
    import { page } from "$app/state";

    let { children } = $props();

    let isVisible: boolean = $state(
        preferencesState.enableAnimations ? false : true,
    );

    let beforeNavigateUrl: string = $state("");
    let afterNavigateUrl: string = $state("");

    onMount(async () => {
        setTimeout(() => {
            isVisible = true;
        }, 0);

        if (!authState.isLoggedIn) {
            await goto("/");
        }

        authState;
    });

    beforeNavigate(() => {
        beforeNavigateUrl = page.url.pathname;
    });

    afterNavigate(() => {
        afterNavigateUrl = page.url.pathname;

        if (beforeNavigateUrl === afterNavigateUrl) return;

        if (!preferencesState.enableAnimations) return;

        isVisible = false;
        setTimeout(() => {
            isVisible = true;
        }, 0);
    });
</script>

<Search />
<NewPassword />

<div class="flex w-full h-screen">
    <Sidebar />
    <div class="flex flex-col w-full h-full overflow-auto">
        <Header />
        <div
            class="border-t border-l h-full w-full border-input rounded-tl-md relative overflow-hidden"
        >
            {#if isVisible}
                <div
                    in:fade={{ duration: preferencesState.animationsDuration }}
                    class="h-full w-full"
                >
                    {@render children()}
                </div>
            {/if}
        </div>
    </div>
</div>
