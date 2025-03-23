import type {
    CheckEmailUsernameAvailabilityResponse,
    ErrorResponse,
} from "./http.types.svelte";
import { fetch } from "@tauri-apps/plugin-http";
import { authState } from "../auth/auth.state.svelte";
import { authService } from "../auth/auth.service.svelte";
import { serverState } from "../server/server.state.svelte";
import { notificationsService } from "../notifications/notifications.service.svelte";

class HttpService {
    public makeRequest = async (
        path: string,
        {
            method = "GET",
            authorization = false,
            body = undefined,
        }: {
            method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
            authorization?: boolean;
            body?: string;
        } = {},
    ): Promise<Response> => {
        try {
            if (!serverState.serverUrl.length) {
                throw new Error("Server URL is not set");
            }

            if (authState.isOfflineMode) {
                throw new Error("Cannot make requests in offline mode");
            }

            const res = await fetch(serverState.serverUrl + path, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorization
                        ? `Bearer ${authState.token}`
                        : "",
                },
                body,
            });

            if (!res.ok) {
                console.error(res);
                if (res.status === 498) {
                    await authService.logOut();
                    notificationsService.sendSessionExpiredNotification();
                    throw new Error("Session expired");
                }

                const errorMessage = await this._handleError(res);
                throw new Error(errorMessage);
            }

            return res;
        } catch (err: any) {
            const errorMessage = err.message || "Unknown error";
            throw new Error(errorMessage);
        }
    };

    public checkEmailUsernameAvailability = async (
        email: string | null,
        username: string | null,
    ): Promise<CheckEmailUsernameAvailabilityResponse> => {
        const res = await this.makeRequest("/users/check", {
            method: "POST",
            authorization: false,
            body: JSON.stringify({
                email,
                username,
            }),
        });

        return (await res.json()) as CheckEmailUsernameAvailabilityResponse;
    };

    private _handleError = async (res: Response): Promise<string> => {
        try {
            const error = (await res.json()) as ErrorResponse;

            console.log(error);

            if (!error.errors) {
                return error.title;
            }

            const errorFields = Object.keys(error.errors);
            if (errorFields.length > 0) {
                const firstField = errorFields[0];
                const firstError = error.errors[firstField][0];

                return `${error.title} ${
                    firstField || "Details"
                }: ${firstError}`;
            }

            return `(${error.status}) ${error.title}`;
        } catch (err: any) {
            return "Unknown error";
        }
    };
}

export const httpService = new HttpService();
