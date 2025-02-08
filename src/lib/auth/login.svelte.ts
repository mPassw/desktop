import auth from "@/state/auth.svelte";
import passwords from "@/state/passwords.svelte";
import server from "@/state/server.svelte";

import { getErrorMessage } from "@/utils";
import { invoke } from "@tauri-apps/api/core";
import { fetch } from "@tauri-apps/plugin-http";

interface Step1Response {
	authId: string;
	email: string;
	username?: string;
	salt: string;
	B: string;
}

interface Step2Response {
	M2: string;
	token: string;
}

export const step1 = async (identifier: string): Promise<Step1Response> => {
	const res = await fetch(server.serverUrl + "/auth/step1", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			identifier: identifier,
		}),
	});

	if (!res.ok) {
		throw new Error(getErrorMessage(await res.json()));
	}

	const jsonData = (await res.json()) as Step1Response;

	auth.email = jsonData.email;

	return jsonData;
};

export const step2 = async (
	authId: string,
	A: string,
	M1: string
): Promise<Step2Response> => {
	const res = await fetch(server.serverUrl + `/auth/step2`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			authId,
			A,
			M1,
			expiresIn: auth.sessionLength,
		}),
	});

	if (!res.ok) {
		throw new Error(getErrorMessage(await res.json()));
	}

	const jsonData = (await res.json()) as Step2Response;

	auth.authToken = jsonData.token;

	return jsonData;
};

/**
 * Calculate encryption key. Returns an empty string to clear password from memory
 */
export const calculateEncryptionKey = async (
	password: string,
	salt: string
) => {
	passwords.encryptionKey = await invoke<Uint8Array>("argon2_hash", {
		password: password,
		salt: salt,
	});

	return "";
};
