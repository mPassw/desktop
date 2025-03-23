import type { Update } from "@tauri-apps/plugin-updater";

class UpdaterState {
    public isUpdateAvailable: boolean = $state(false);
    public isUpdateDialogOpen: boolean = $state(false);

    public updateData: Update | null = $state(null);
}

export const updaterState = new UpdaterState();
