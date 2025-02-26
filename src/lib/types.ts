/**
 * Auth response 1
 */
export interface Step1Response {
	authId: string;
	email: string;
	username: string | null;
	salt: string;
	b: string;
}

/**
 * Auth response 2
 */
export interface Step2Response {
	m2: string;
	token: string;
}

export interface SMTPSettings {
	host: string | null;
	port: number | null;
	username: string | null;
	password: string | null;
	enableSsl: boolean | null;
}

export interface User {
	id: string;
	email: string;
	username: string | null;
	verified: boolean;
	admin: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Password {
	id: string;
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
