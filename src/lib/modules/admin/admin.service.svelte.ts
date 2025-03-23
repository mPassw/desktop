import type { User } from "../auth/auth.types.svelte";
import type { SmtpSettings } from "./admin.types.svelte";
import { httpService } from "../http/http.service.svelte";
import { adminState } from "./admin.state.svelte";

class AdminService {
    public getSmtpSettings = async (): Promise<void> => {
        const res = await httpService.makeRequest("/smtp", {
            method: "GET",
            authorization: true,
        });

        adminState.smtpSettings = (await res.json()) as SmtpSettings;
    };

    public saveSmtpSettings = async (): Promise<void> => {
        await httpService.makeRequest("/smtp", {
            method: "PATCH",
            authorization: true,
            body: JSON.stringify(adminState.smtpSettings),
        });
    };

    public sendTestEmail = async (recipient: string): Promise<void> => {
        await httpService.makeRequest("/smtp", {
            method: "POST",
            authorization: true,
            body: JSON.stringify({ recipient }),
        });
    };

    public getUsers = async (): Promise<void> => {
        const res = await httpService.makeRequest("/users", {
            method: "GET",
            authorization: true,
        });

        adminState.users = (await res.json()) as User[];
    };

    public toggleUserRole = async (userId: string): Promise<void> => {
        await httpService.makeRequest(`/users/${userId}/admin`, {
            method: "PATCH",
            authorization: true,
        });

        await this.getUsers();
    };

    public toggleUserVerified = async (userId: string): Promise<void> => {
        await httpService.makeRequest(`/users/${userId}/verification`, {
            method: "PATCH",
            authorization: true,
        });

        await this.getUsers();
    };
}

export const adminService = new AdminService();
