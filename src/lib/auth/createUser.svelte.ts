import { getErrorMessage, makeRequest } from "@/utils";
import { createVerifierAndSalt, SRPParameters, SRPRoutines } from "tssrp6a";

export const createUser = async (
	email: string,
	username: string,
	password: string
) => {
	const { s: salt, v: verifier } = await createVerifierAndSalt(
		new SRPRoutines(new SRPParameters()),
		email,
		password,
		16
	);

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
