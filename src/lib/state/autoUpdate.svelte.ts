import { relaunch } from "@tauri-apps/plugin-process";
import osInfo from "./osInfo.svelte";

import { check } from "@tauri-apps/plugin-updater";
import { toast } from "svelte-sonner";
import loadersState from "./loaders.svelte";

class AutoUpdate {
	public isUpdateAvailable: boolean = $state(false);
	public isUpdateDialogOpen: boolean = $state(false);

	public availableVersion: string = $state("unknown");

	public currentUpdateStatus: string | undefined = $state(undefined);

	public checkForUpdates = async (): Promise<void> => {
		// if (osInfo.os !== "windows" || process.env.NODE_ENV === "development")
		// 	return;

		try {
			const update = await check();

			if (update) {
				this.isUpdateAvailable = true;
				this.isUpdateDialogOpen = true;

				this.availableVersion = update.version;
			}
		} catch (err: any) {
			toast.warning(`Error checking for updates: ${err.message}`);
		}
	};

	public update = async (): Promise<void> => {
		try {
			loadersState.isDialogLoaderVisible = true;

			const update = await check();

			if (!update) {
				this.isUpdateDialogOpen = false;
				throw new Error("No update available");
			}

			let downloaded: number = 0;
			let contentLength: number | undefined = 0;

			await update.downloadAndInstall((event) => {
				switch (event.event) {
					case "Started":
						contentLength = event.data.contentLength;
						this.currentUpdateStatus = "Download started";
						break;
					case "Progress":
						downloaded += event.data.chunkLength;
						this.currentUpdateStatus = `Downloading... ${Math.round(
							(downloaded / contentLength!) * 100
						)}%`;
						break;
					case "Finished":
						this.currentUpdateStatus = "Download finished";
						break;
				}
			});

			await relaunch();
		} catch (err: any) {
			toast.error(`Error updating: ${err.message}`);
		} finally {
			loadersState.isDialogLoaderVisible = false;
		}
	};
}

const autoUpdate = new AutoUpdate();
export default autoUpdate;
