import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Buffer } from "buffer";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Get error message from server response
 */
export const getErrorMessage = (error: any): string => {
	if (typeof error === "string") return error;
	if (error?.message) {
		if (Array.isArray(error.message)) return error.message[0];
		if (typeof error.message === "string") return error.message;
	}
	return "An unknown error occurred";
};

/**
 * There is no URL.parse in Microsoft Edge WebView, so this function basically does the same thing
 */
export const parseUrl = (url: string) => {
	if (!/^\w+:\/\//.test(url)) {
		url = "http://" + url;
	}

	const urlPattern = new RegExp(
		"^(?:([^:/?#]+):)?" + // protocol
			"(?://(?:([^/?#]*)@)?" + // authentication
			"([^/?#:]+)?" + // hostname
			"(?::(\\d+))?)?" + // port
			"([^?#]*)" + // pathname
			"(?:\\?([^#]*))?" + // search/query
			"(?:#(.*))?" // hash/fragment
	);

	const matches = url.match(urlPattern);

	if (!matches) return null;

	let auth = null;
	if (matches[2]) {
		const [username, password = ""] = matches[2].split(":");
		auth = { username, password };
	}

	const hostname = matches[3] || "";
	const port = matches[4] || "";
	const host = hostname + (port ? `:${port}` : "");

	return {
		protocol: matches[1] || "",
		auth,
		hostname,
		port,
		host,
		pathname: matches[5] || "",
		search: matches[6] ? "?" + matches[6] : "",
		hash: matches[7] ? "#" + matches[7] : "",
	};
};

export const getDomainFromUrl = (url: string): string | null => {
	const parsedUrl = parseUrl(url);

	return parsedUrl ? parsedUrl.hostname : null;
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
