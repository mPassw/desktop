<script lang="ts">
    import MPass from "../../svgs/mPass.svelte";

    import { Button } from "$lib/components/ui/button";
    import {
        CircleFadingArrowUp,
        KeyRound,
        RectangleEllipsis,
        Trash2,
        Wrench,
    } from "lucide-svelte";
    import { page } from "$app/state";
    import { systemInformationState } from "$lib/modules/systemInformation/systemInformation.state.svelte";
    import { fade, slide } from "svelte/transition";
    import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";
    import { updaterState } from "$lib/modules/updater/updater.state.svelte";
    import { authState } from "$lib/modules/auth/auth.state.svelte";

    const routes = [
        {
            href: "/dashboard/passwords",
            icon: RectangleEllipsis,
            text: "Passwords",
        },
        {
            href: "/dashboard/trash",
            icon: Trash2,
            text: "Trash",
        },
        {
            href: "/dashboard/generator",
            icon: KeyRound,
            text: "Generator",
        },
        {
            href: "/dashboard/tools",
            icon: Wrench,
            text: "Tools",
            disabled: () => authState.isOfflineMode,
        },
    ];

    let isHovered: boolean = $state(false);
</script>

<aside
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
    class="flex flex-col justify-between h-screen overflow-y-auto overflow-x-hidden p-2 w-[4.7rem] hover:w-52 transition-all"
>
    <ul class="flex flex-col gap-1">
        {#if systemInformationState.platform !== "macos"}
            <li
                class="flex justify-center items-center mt-1.5 pointer-events-none"
            >
                <MPass width={28} height={28} />
                {#if isHovered}
                    <p
                        transition:slide={{
                            duration: preferencesState.animationsDuration / 2,
                            axis: "x",
                        }}
                        class="tracking-tight font-semibold"
                    >
                        mPass
                    </p>
                {/if}
            </li>
        {/if}
        {#each routes as route, index}
            <li
                class={systemInformationState.platform === "macos" &&
                index === 0
                    ? "mt-14"
                    : index === 0
                      ? "mt-5"
                      : ""}
            >
                {#if route.disabled?.()}
                    <Button
                        variant="ghost"
                        class="text-lg w-full justify-start"
                        disabled
                    >
                        <route.icon size={24} class="shrink-0" />
                        {#if isHovered}
                            <span
                                transition:slide={{
                                    duration:
                                        preferencesState.animationsDuration / 2,
                                    axis: "x",
                                }}
                            >
                                {route.text}
                            </span>
                        {/if}
                    </Button>
                {:else}
                    <Button
                        variant="ghost"
                        href={route.href}
                        class="text-lg w-full justify-start {page.url
                            .pathname === route.href
                            ? 'bg-accent'
                            : ''}"
                    >
                        <route.icon size={24} class="shrink-0" />
                        {#if isHovered}
                            <span
                                transition:slide={{
                                    duration:
                                        preferencesState.animationsDuration / 2,
                                    axis: "x",
                                }}
                            >
                                {route.text}
                            </span>
                        {/if}
                    </Button>
                {/if}
            </li>
        {/each}
    </ul>

    <ul class="flex flex-col gap-1">
        {#if (systemInformationState.platform === "windows" || systemInformationState.platform === "macos") && updaterState.isUpdateAvailable}
            <li>
                <Button
                    variant="ghost"
                    class="text-lg w-full justify-start"
                    onclick={() => (updaterState.isUpdateDialogOpen = true)}
                >
                    <CircleFadingArrowUp size={24} class="shrink-0" />
                    {#if isHovered}
                        <span
                            transition:slide={{
                                duration:
                                    preferencesState.animationsDuration / 2,
                                axis: "x",
                            }}
                        >
                            Update
                        </span>
                    {/if}
                </Button>
            </li>
        {/if}
    </ul>
</aside>
