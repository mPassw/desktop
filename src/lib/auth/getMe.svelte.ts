import auth from "@/state/auth.svelte";
import server from "@/state/server.svelte";

import { getErrorMessage } from "@/utils";
import { fetch } from "@tauri-apps/plugin-http";

interface GetMeResponse {
	id: number;
	email: string;
	username?: string;
	verified: boolean;
	admin: boolean;
	createdAt: string;
	updatedAt: string;
}

export const getMe = async (): Promise<void> => {
	const res = await fetch(server.serverUrl + "/users/@me", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${auth.authToken}`,
		},
	});

	if (!res.ok) {
		throw new Error(getErrorMessage(await res.json()));
	}

	const jsonData: GetMeResponse = await res.json();

	auth.username = jsonData.username ?? "";
	auth.isAdmin = jsonData.admin;
	auth.isVerified = jsonData.verified;
	auth.createdAt = jsonData.createdAt;
	auth.updatedAt = jsonData.updatedAt;
};
