import { getErrorMessage, makeRequest } from "@/utils";
import { createVerifierAndSalt, SRPParameters, SRPRoutines } from "tssrp6a";

export const createUser = async (
	email: string,
	username: string,
	password: string
) => {
	const { salt, verifier } = await generateSaltAndVerifier(email, password);

	const res = await makeRequest("/users", "POST", {
		body: JSON.stringify({
			email: email,
			username: username,
			salt: salt.toString(16),
			verifier: verifier.toString(16),
		}),
	});

	if (res.status !== 201) {
		throw new Error(getErrorMessage(await res.json()));
	}
};

export const generateSaltAndVerifier = async (
	email: string,
	password: string
): Promise<{ salt: bigint; verifier: bigint }> => {
	const { s: salt, v: verifier } = await createVerifierAndSalt(
		new SRPRoutines(new SRPParameters()),
		email,
		password,
		16
	);

	return {
		salt,
		verifier,
	};
};
