/**
 * Auth response 1
 */
export interface Step1Response {
	authId: string;
	email: string;
	username: string | null;
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
	host: string | null;
	port: number | null;
	username: string | null;
	password: string | null;
	ssl: boolean | null;
}

export interface User {
	id: number;
	email: string;
	username: string | null;
	verified: boolean;
	admin: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Password {
	id: number;
	inTrash: boolean;
	title: string;
	username: string | null;
	password: string | null;
	note: string | null;
	websites: string[];
	tags: string[];
	createdAt: string;
	updatedAt: string;
}
