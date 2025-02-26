import type { User } from "@/types";
import { makeRequest } from "@/utils";

interface AdminViewUser extends User {
	passwords: number;
}

class AdminState {
	public smtpHost: string = $state("");
	public smtpPort: number | undefined = $state();
	public smtpUsername: string = $state("");
	public smtpPassword: string = $state("");
	public smtpSender: string = $state("");
	public smtpSsl: boolean = $state(false);

	public users: AdminViewUser[] = $state([]);

	/**
	 * Get SMTP settings from the server
	 */
	public getSmtpSettings = async (): Promise<void> => {
		const res = await makeRequest("/smtp", "GET", {
			authorization: true,
		});

		const data = await res.json();

		this.smtpHost = data.host ?? "";
		this.smtpPort = data.port ?? 0;
		this.smtpUsername = data.username ?? "";
		this.smtpPassword = data.password ?? "";
		this.smtpSender = data.sender ?? "";
		this.smtpSsl = data.enableSsl ?? false;
	};

	/**
	 * Update SMTP settings on the server
	 */
	public updateSmtpSettings = async (): Promise<void> => {
		await makeRequest("/smtp", "PATCH", {
			authorization: true,
			body: JSON.stringify({
				host: this.smtpHost,
				port: this.smtpPort,
				username: this.smtpUsername,
				password: this.smtpPassword,
				sender: this.smtpSender,
				enableSsl: this.smtpSsl,
			}),
		});
	};

	public sendTestEmail = async (recipient: string): Promise<void> => {
		await makeRequest("/smtp", "POST", {
			authorization: true,
			body: JSON.stringify({
				recipient,
			}),
		});
	};

	/**
	 * Get all users from the server
	 */
	public getUsers = async (): Promise<void> => {
		this.users = [];

		const res = await makeRequest("/users", "GET", {
			authorization: true,
		});

		this.users = (await res.json()) as AdminViewUser[];
	};

	/**
	 * Toggle user verification status
	 */
	public toggleUserVerification = async (id: string): Promise<void> => {
		await makeRequest(`/users/${id}/verification`, "PATCH", {
			authorization: true,
		});

		const userIndex = this.users.findIndex((user) => user.id === id);
		if (userIndex !== -1) {
			this.users[userIndex].verified = !this.users[userIndex].verified;
		}
	};

	/**
	 * Toggle user admin status
	 */
	public toggleUserAdminStatus = async (id: string): Promise<void> => {
		await makeRequest(`/users/${id}/admin`, "PATCH", {
			authorization: true,
		});

		const userIndex = this.users.findIndex((user) => user.id === id);
		if (userIndex !== -1) {
			this.users[userIndex].admin = !this.users[userIndex].admin;
		}
	};

	/**
	 * Remove SMTP data from memory
	 */
	public clearSmtpSettings = () => {
		this.smtpHost = "";
		this.smtpPort = undefined;
		this.smtpUsername = "";
		this.smtpPassword = "";
		this.smtpSender = "";
		this.smtpSsl = false;
	};

	/**
	 * Remove all users from memory
	 */
	public clearUsers = () => {
		this.users = [];
	};
}

const admin = new AdminState();
export default admin;
