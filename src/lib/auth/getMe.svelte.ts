import auth from "@/state/auth.svelte";

import { makeRequest } from "@/utils";

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
	const res = await makeRequest("/users/@me", "GET", {
		authorization: true,
	});

	const jsonData: GetMeResponse = await res.json();

	auth.username = jsonData.username ?? "";
	auth.isAdmin = jsonData.admin;
	auth.isVerified = jsonData.verified;
	auth.createdAt = jsonData.createdAt;
	auth.updatedAt = jsonData.updatedAt;
};
