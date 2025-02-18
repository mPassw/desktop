/**
 * Auth response 1
 */
export interface Step1Response {
	authId: string;
	email: string;
	username?: string;
	salt: string;
	B: string;
}

/**
 * Auth response 2
 */
export interface Step2Response {
	M2: string;
	token: string;
}

export interface SMTPSettings {
	host?: string;
	port?: number;
	username?: string;
	password?: string;
	ssl?: boolean;
}

export interface User {
	id: number;
	email: string;
	username?: string;
	verified: boolean;
	admin: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Password {
	id: number;
	inTrash: boolean;
	title: string;
	username: EncryptedField;
	password: EncryptedField;
	note: EncryptedField;
	websites: string[];
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

export interface EncryptedField {
	value: string;
	salt: string;
	nonce: string;
}
