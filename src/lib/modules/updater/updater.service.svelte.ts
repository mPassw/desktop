import { check } from "@tauri-apps/plugin-updater";
import { updaterState } from "./updater.state.svelte";
import { loadersState } from "../loaders/loaders.state.svelte";
import { relaunch } from "@tauri-apps/plugin-process";

class UpdaterService {
    public checkForUpdates = async (): Promise<void> => {
        const update = await check({
            timeout: 10000,
        });

        if (update) {
            updaterState.isUpdateAvailable = true;
            updaterState.updateData = update;
        }
    };

    public updateApp = async (): Promise<void> => {
        if (!updaterState.updateData) {
            throw new Error("No update available");
        }

        let downloaded = 0;
        let contentLength = 0;

        await updaterState.updateData.downloadAndInstall((event) => {
            switch (event.event) {
                case "Started":
                    contentLength = event.data.contentLength ?? 0;
                    loadersState.dialogLoaderStatus = "Downloading...";
                    break;
                case "Progress":
                    downloaded += event.data.chunkLength;
                    loadersState.dialogLoaderStatus = `Downloading... ${Math.round((downloaded / contentLength) * 100)}%`;
                    break;
                case "Finished":
                    loadersState.dialogLoaderStatus =
                        "Download complete. Installing...";
                    break;
            }
        });

        await relaunch();
    };
}

export const updaterService = new UpdaterService();
