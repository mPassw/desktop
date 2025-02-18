import auth from "@/state/auth.svelte";
import type { User } from "@/types";

import { makeRequest } from "@/utils";

export const getMe = async (): Promise<void> => {
	const res = await makeRequest("/users/@me", "GET", {
		authorization: true,
	});

	const jsonData: User = await res.json();

	auth.id = jsonData.id;
	auth.username = jsonData.username ?? "";
	auth.isAdmin = jsonData.admin;
	auth.isVerified = jsonData.verified;
	auth.createdAt = jsonData.createdAt;
	auth.updatedAt = jsonData.updatedAt;
};
