import { app } from "@tauri-apps/api";
import { arch, platform, version } from "@tauri-apps/plugin-os";

class SystemInformationState {
    public appVersion: string = $state("unknown");
    public platform: string = $state("unknown");
    public arch: string = $state("unknown");
    public version: string = $state("unknown");

    public getOsInfo = async () => {
        this.appVersion = await app.getVersion();
        this.platform = platform();
        this.arch = arch();
        this.version = version();
    };
}

export const systemInformationState = new SystemInformationState();
