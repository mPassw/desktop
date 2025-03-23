<script lang="ts">
    import * as Avatar from "$lib/components/ui/avatar/index.js";

    import type { Password } from "$lib/modules/passwords/passwords.types.svelte";
    import { Badge } from "$lib/components/ui/badge";
    import { getDomainFromUrl } from "$lib/utils";
    import { GlobeLock } from "lucide-svelte";
    import { passwordsService } from "$lib/modules/passwords/passwords.service.svelte";
    import { toast } from "svelte-sonner";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";
    import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";

    let {
        password,
    }: {
        password: Password;
    } = $props();

    const setSelectedPassword = async () => {
        try {
            await passwordsService.setSelectedPassword(password);
        } catch (err: any) {
            toast.error(err.message);
        }
    };
</script>

<button
    onclick={setSelectedPassword}
    class="flex h-16 w-full items-center text-start gap-1.5 p-2 hover:bg-foreground/5 {passwordsState
        .selectedPassword?.id === password.id
        ? 'bg-foreground/5'
        : ''}"
>
    <Avatar.Root>
        <Avatar.Image
            class="bg-muted-foreground/20"
            src={password.websites.length &&
            preferencesState.enableIcons === "enable"
                ? `https://icons.duckduckgo.com/ip3/${getDomainFromUrl(password.websites[0])}.ico`
                : ""}
        />
        <Avatar.Fallback>
            <GlobeLock />
        </Avatar.Fallback>
    </Avatar.Root>
    <div class="flex flex-col w-full truncate">
        <p class="truncate">{password.title}</p>
        <div class="flex items-center gap-1.5">
            {#each password.tags.slice(0, 3) as tag}
                <Badge variant="outline">
                    {tag}
                </Badge>
            {/each}
        </div>
    </div>
</button>
