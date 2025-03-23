export interface User {
	id: string;
	email: string;
	username?: string;
	admin: boolean;
	verified: boolean;
	createdAt: string;
	updatedAt: string;
	passwords?: number;
}

export interface GenerateSaltAndVerifierResponse {
	salt: string;
	verifier: string;
}

export interface GenerateSrpCredentialsResponse {
	private_key: string;
	public_key: string;
}

export interface LoginResponse1 {
	authId: string;
	email: string;
	username: string | null;
	salt: string;
	b: string;
}

export interface LoginResponse2 {
	m2: string;
	token: string;
}
