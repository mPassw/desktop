<script lang="ts">
    import * as ToggleGroup from "$lib/components/ui/toggle-group";

    import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";
    import { preferencesService } from "$lib/modules/preferences/preferences.service.svelte";

    const availableDurations = ["5m", "10m", "30m", "1h", "2h"];

    const setSessionDuration = async (
        duration: "5m" | "10m" | "30m" | "1h" | "2h",
    ) => {
        await preferencesService.setSessionDuration(duration);
    };
</script>

<div class="flex w-full justify-between items-center">
    <div class="flex flex-col">
        <p class="text-lg font-medium tracking-tight leading-none">
            Session duration
        </p>
        <p class="text-xs text-muted-foreground font-normal">
            (changes will take effect upon next login)
        </p>
    </div>
    <ToggleGroup.Root
        type="single"
        variant="outline"
        bind:value={preferencesState.sessionDuration}
    >
        {#each availableDurations as duration}
            <ToggleGroup.Item
                value={duration}
                onclick={async () =>
                    await preferencesService.setSessionDuration(
                        duration as "5m" | "10m" | "30m" | "1h" | "2h",
                    )}
            >
                {duration}
            </ToggleGroup.Item>
        {/each}
    </ToggleGroup.Root>
</div>
