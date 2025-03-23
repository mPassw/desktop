<script lang="ts">
    import * as ToggleGroup from "$lib/components/ui/toggle-group";

    import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";
    import { preferencesService } from "$lib/modules/preferences/preferences.service.svelte";
</script>

<div class="flex w-full justify-between items-center">
    <div class="flex flex-col">
        <p class="text-lg font-medium tracking-tight leading-none">
            Animations
        </p>
        <p class="text-xs text-muted-foreground">
            Note: some essential animations may still appear even when disabled
        </p>
    </div>
    <ToggleGroup.Root
        type="single"
        variant="outline"
        bind:value={preferencesState.enableAnimations}
    >
        <ToggleGroup.Item
            value="enable"
            onclick={async () => await preferencesService.enableAnimations()}
        >
            Enable
        </ToggleGroup.Item>
        <ToggleGroup.Item
            value="disable"
            onclick={async () => await preferencesService.disableAnimations()}
        >
            Disable
        </ToggleGroup.Item>
    </ToggleGroup.Root>
</div>
