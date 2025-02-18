import auth from "@/state/auth.svelte";
import passwords from "@/state/passwords.svelte";

import type { Step1Response, Step2Response } from "@/types";
import { makeRequest } from "@/utils";
import { invoke } from "@tauri-apps/api/core";

export const step1 = async (identifier: string): Promise<Step1Response> => {
	const res = await makeRequest("/auth/step1", "POST", {
		body: JSON.stringify({
			identifier,
		}),
	});

	const jsonData = (await res.json()) as Step1Response;

	auth.email = jsonData.email;

	return jsonData;
};

export const step2 = async (
	authId: string,
	A: string,
	M1: string
): Promise<Step2Response> => {
	const res = await makeRequest("/auth/step2", "POST", {
		body: JSON.stringify({
			authId,
			A,
			M1,
			expiresIn: auth.sessionLength,
		}),
	});

	const jsonData = (await res.json()) as Step2Response;

	auth.authToken = jsonData.token;

	return jsonData;
};

export const calculateEncryptionKey = async (
	password: string,
	salt: string
) => {
	passwords.encryptionKey = await invoke<Uint8Array>("argon2_hash", {
		password: password,
		salt: salt,
	});
};
