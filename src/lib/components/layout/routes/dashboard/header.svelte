<script lang="ts">
    import * as Tooltip from "$lib/components/ui/tooltip";

    import { Button, buttonVariants } from "$lib/components/ui/button";
    import {
        Command,
        DatabaseBackup,
        ListPlus,
        LogOut,
        Search,
        Settings,
        ShieldUser,
        User,
    } from "lucide-svelte";
    import { authState } from "$lib/modules/auth/auth.state.svelte";
    import { page } from "$app/state";
    import { passwordsService } from "$lib/modules/passwords/passwords.service.svelte";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { toast } from "svelte-sonner";
    import { authService } from "$lib/modules/auth/auth.service.svelte";
    import { Badge } from "$lib/components/ui/badge";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";

    const routes = [
        {
            href: "/dashboard/profile",
            icon: User,
            text: "Profile",
            disabled: () => authState.isOfflineMode,
        },
        {
            href: "/dashboard/settings",
            icon: Settings,
            text: "Settings",
            disabled: () => authState.isOfflineMode,
        },
        {
            href: "/dashboard/admin",
            icon: ShieldUser,
            text: "Admin",
            disabled: () => !authState.user?.admin || authState.isOfflineMode,
        },
        {
            onclick: authService.logOut,
            icon: LogOut,
            text: "Logout",
        },
    ];

    const updatePasswordsList = async () => {
        try {
            loadersState.isFullscreenLoaderVisible = true;

            await passwordsService.fetchPasswords();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message);
        } finally {
            loadersState.isFullscreenLoaderVisible = false;
        }
    };
</script>

<header class="flex items-center justify-between w-full p-2">
    <ul class="flex items-center gap-1 z-30">
        {#each routes as route}
            <li>
                {#if route.href}
                    {#if route.disabled?.()}
                        <Button
                            variant="ghost"
                            disabled
                            class="{page.url.pathname === route.href
                                ? 'bg-accent'
                                : ''} {route.text === 'Admin' &&
                            !authState.user?.admin
                                ? 'hidden'
                                : ''}"
                        >
                            <route.icon size={20} />
                            {route.text}
                        </Button>
                    {:else}
                        <Button
                            variant="ghost"
                            href={route.href}
                            class={page.url.pathname === route.href
                                ? "bg-accent"
                                : ""}
                        >
                            <route.icon size={20} />
                            {route.text}
                        </Button>
                    {/if}
                {:else}
                    <Button
                        variant="ghost"
                        onclick={route.onclick}
                        disabled={route.disabled?.()}
                    >
                        <route.icon size={20} />
                        {route.text}
                    </Button>
                {/if}
            </li>
        {/each}
    </ul>
    <ul class="flex items-center gap-1 z-30">
        <li>
            <Button
                variant="outline"
                class="gap-4"
                onclick={() => (passwordsState.isSearchOpen = true)}
            >
                <div class="flex gap-1 items-center">
                    <Search size={18} />
                    Search
                </div>
                <div class="flex items-center text-xs">
                    <Command size={12} />
                    K
                </div>
            </Button>
        </li>
        {#if page.url.pathname === "/dashboard/passwords" || page.url.pathname === "/dashboard/trash"}
            <li>
                <Tooltip.Root>
                    <Tooltip.Trigger
                        class={buttonVariants({
                            variant: "outline",
                            size: "icon",
                        })}
                        disabled={authState.isOfflineMode}
                        onclick={updatePasswordsList}
                    >
                        <DatabaseBackup size={20} />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p class="select-none cursor-default">
                            Refresh passwords
                        </p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </li>
            <li>
                <Tooltip.Root>
                    <Tooltip.Trigger
                        class={buttonVariants({
                            variant: "outline",
                            size: "icon",
                        })}
                        disabled={authState.isOfflineMode}
                        onclick={() =>
                            (passwordsState.isNewPasswordDialogOpen = true)}
                    >
                        <ListPlus size={22} />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p class="select-none cursor-default">Add password</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </li>
        {/if}
    </ul>
</header>
