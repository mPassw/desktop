import { check } from "@tauri-apps/plugin-updater";
import { toast } from "svelte-sonner";

class OsInfoState {
	public os: string = $state("");
	public version: string = $state("");
	public arch: string = $state("");
	public hostname: string = $state("");
	public appVersion: string = $state("");
}

const osInfo = new OsInfoState();
export default osInfo;
