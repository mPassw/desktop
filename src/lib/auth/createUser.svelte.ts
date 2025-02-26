import { getErrorMessage, makeRequest } from "@/utils";
import { invoke } from "@tauri-apps/api/core";

export const createUser = async (
	email: string,
	username: string,
	password: string
) => {
	const { salt, verifier } = await generateSaltAndVerifier(email, password);

	const res = await makeRequest("/users", "POST", {
		body: JSON.stringify({
			email: email,
			username: username.length ? username : null,
			salt: salt,
			verifier: verifier,
		}),
	});

	if (res.status !== 201) {
		throw new Error(getErrorMessage(await res.json()));
	}
};

export const generateSaltAndVerifier = async (
	email: string,
	password: string
): Promise<{ salt: string; verifier: string }> => {
	const salt = await invoke<string>("generate_salt");
	const verifier = await invoke<string>("generate_verifier", {
		username: email,
		password: password,
		salt: salt,
	});

	return {
		salt: salt,
		verifier: verifier,
	};
};
