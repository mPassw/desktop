<script lang="ts">
    import * as Command from "$lib/components/ui/command";

    import type { Password } from "$lib/modules/passwords/passwords.types.svelte";
    import { goto } from "$app/navigation";
    import { authState } from "$lib/modules/auth/auth.state.svelte";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";
    import {
        KeyRound,
        LogOut,
        RectangleEllipsis,
        Settings,
        ShieldUser,
        User,
        Wrench,
    } from "lucide-svelte";
    import { authService } from "$lib/modules/auth/auth.service.svelte";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import { passwordsService } from "$lib/modules/passwords/passwords.service.svelte";

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            passwordsState.isSearchOpen = !passwordsState.isSearchOpen;
        }
    };

    const gotoPassword = async (password: Password) => {
        closeSearch();

        if (password.inTrash) {
            await goto("/dashboard/trash");
            await passwordsService.setSelectedPassword(password);
        } else {
            await goto("/dashboard/passwords/");
            await passwordsService.setSelectedPassword(password);
        }
    };

    const closeSearch = () => {
        passwordsState.isSearchOpen = false;
        passwordsState.searchValue = "";
    };
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open={passwordsState.isSearchOpen}>
    <Command.Input
        bind:value={passwordsState.searchValue}
        placeholder="Seach passwords..."
    />
    <Command.List class="overflow-hidden">
        <ScrollArea class="h-full">
            <Command.Empty>No passwords found</Command.Empty>
            <Command.Group heading="Passwords">
                {#each passwordsState.passwords as password}
                    <Command.Item
                        class="h-8"
                        onSelect={async () => await gotoPassword(password)}
                    >
                        <RectangleEllipsis />
                        {password.title}
                    </Command.Item>
                {/each}
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Other">
                <Command.Item
                    class="h-8"
                    onSelect={async () => {
                        closeSearch();
                        await goto("/dashboard/profile");
                    }}
                >
                    <User size={16} />
                    Profile
                </Command.Item>
                <Command.Item
                    class="h-8"
                    onSelect={async () => {
                        closeSearch();
                        await goto("/dashboard/settings");
                    }}
                >
                    <Settings />
                    Settings
                </Command.Item>
                {#if authState.user?.admin}
                    <Command.Item
                        class="h-8"
                        onSelect={async () => {
                            closeSearch();
                            await goto("/dashboard/admin");
                        }}
                    >
                        <ShieldUser />
                        Admin
                    </Command.Item>
                {/if}
                <Command.Item
                    class="h-8"
                    onSelect={async () => {
                        closeSearch();
                        await goto("/dashboard/generator");
                    }}
                >
                    <KeyRound />
                    Generator
                </Command.Item>
                <Command.Item
                    class="h-8"
                    onSelect={async () => {
                        closeSearch();
                        await goto("/dashboard/tools");
                    }}
                >
                    <Wrench />
                    Tools
                </Command.Item>
                <Command.Item
                    class="h-8"
                    onSelect={async () => {
                        closeSearch();
                        await authService.logOut();
                    }}
                >
                    <LogOut />
                    Logout
                </Command.Item>
            </Command.Group>
        </ScrollArea>
    </Command.List>
</Command.Dialog>
