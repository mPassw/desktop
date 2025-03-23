<script lang="ts">
    import "../app.css";

    import * as Tooltip from "$lib/components/ui/tooltip";

    import FullScreenLoader from "$lib/components/layout/loaders/fullScreenLoader.svelte";
    import MacosTitlebar from "$lib/components/layout/macosTitlebar.svelte";

    import { ModeWatcher } from "mode-watcher";
    import { Toaster } from "$lib/components/ui/sonner";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { onMount } from "svelte";
    import { systemInformationState } from "$lib/modules/systemInformation/systemInformation.state.svelte";
    import { preferencesService } from "$lib/modules/preferences/preferences.service.svelte";
    import { notificationsService } from "$lib/modules/notifications/notifications.service.svelte";
    import { notificationsState } from "$lib/modules/notifications/notifications.state.svelte";
    import { updaterService } from "$lib/modules/updater/updater.service.svelte";
    import { updaterState } from "$lib/modules/updater/updater.state.svelte";
    import UpdateDialog from "$lib/components/layout/updateDialog.svelte";

    let { children } = $props();

    onMount(() => {
        preferencesService.getPreferences().catch((err) => console.error(err));
        systemInformationState.getOsInfo().catch((err) => console.error(err));
        notificationsService
            .getPermissions()
            .catch((err) => console.error(err));

        if (
            systemInformationState.platform === "windows" ||
            systemInformationState.platform === "macos"
        ) {
            updaterService.checkForUpdates().catch((err) => console.error(err));
        }

        if (!notificationsState.permissionsGranted) {
            notificationsService
                .requestPermissions()
                .catch((err) => console.error(err));
        }
    });
</script>

<ModeWatcher />
<Toaster />

{#if process.env.NODE_ENV === "development"}
    <div
        class="fixed bottom-1 left-1 text-xs text-muted-foreground select-none cursor-default"
    >
        Debug
    </div>
{/if}

{#if loadersState.isFullscreenLoaderVisible}
    <FullScreenLoader />
{/if}

{#if systemInformationState.platform === "macos"}
    <MacosTitlebar />
{/if}

{#if updaterState.isUpdateDialogOpen}
    <UpdateDialog />
{/if}

<Tooltip.Provider delayDuration={100}>
    <main
        class="select-none {loadersState.isFullscreenLoaderVisible
            ? 'blur-sm'
            : ''}"
    >
        {@render children()}
    </main>
</Tooltip.Provider>
