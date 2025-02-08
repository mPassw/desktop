import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Buffer } from "buffer";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: any) => {
	if (typeof error === "string") return error;
	if (error?.message) {
		if (Array.isArray(error.message)) return error.message[0];
		if (typeof error.message === "string") return error.message;
	}
	return "An unknown error occurred";
};

export const getJWTExpiration = (token: string): number | null => {
	try {
		const [, payloadBase64] = token.split(".");
		if (!payloadBase64) return null;

		const payload = JSON.parse(
			Buffer.from(payloadBase64, "base64").toString("utf-8")
		);

		return payload.exp || null;
	} catch {
		return null;
	}
};
