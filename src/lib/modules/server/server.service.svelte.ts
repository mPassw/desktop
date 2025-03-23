import { httpService } from "../http/http.service.svelte";
import { storageService } from "../storage/storage.service.svelte";
import { serverState } from "./server.state.svelte";

class ServerService {
    /**
     * Check if the url is a valid server url.
     * Sets the server url and version in the state if valid.
     * Saves the server url in json storage
     */
    public checkServer = async (url: string) => {
        if (!url.match(/^https?:\/\//i)) {
            url = "https://" + url;
        }

        // remove trailing slash
        url = url.replace(/\/+$/, "");
        serverState.serverUrl = url;

        const res = await httpService.makeRequest("/");

        const versionHeader = res.headers.get("x-mpass-version");
        if (!versionHeader) {
            throw new Error("Invalid server url");
        }

        serverState.serverUrl = url;
        serverState.serverVersion = versionHeader;

        await storageService.setLastServerUrl(url);
    };
}

export const serverService = new ServerService();
