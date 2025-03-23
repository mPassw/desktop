import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
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
