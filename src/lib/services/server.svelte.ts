import preferences from "./preferences.svelte";
import authState from "./auth.svelte";

import { makeRequest } from "@/utils";

class ServerState {
	public serverUrl: string = $state("");
	public serverVersion: string = $state("");
	public automaticValidation: boolean = $state(false);

	public loadServerUrl = async () =>
		(this.serverUrl = (await preferences.getServerUrl()) ?? "");

	public loadServerAutomaticValidation = async () =>
		(this.automaticValidation =
			(await preferences.getServerAutomaticValidation()) ?? false);

	/**
	 * Checks for the header `x-mpass-version` in the server response
	 */
	public validate = async () => {
		if (!this.serverUrl.match(/^https?:\/\//)) {
			this.serverUrl = "https://" + this.serverUrl;
		}

		if (this.serverUrl.endsWith("/")) {
			this.serverUrl = this.serverUrl.slice(0, -1);
		}

		const res = await makeRequest("/", "GET");

		if (!res.ok) {
			throw new Error("Invalid server URL");
		}

		if (!res.headers.get("x-mpass-version")) {
			throw new Error("Invalid server URL");
		}

		this.serverVersion = res.headers.get("x-mpass-version") ?? "unknown";

		await preferences.setServerUrl(this.serverUrl);
		await preferences.setServerAutomaticValidation(
			this.automaticValidation
		);

		authState.loginState = "login";
	};
}

const server = new ServerState();
export default server;
