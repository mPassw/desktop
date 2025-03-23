import type { User } from "../auth/auth.types.svelte";
import type { SmtpSettings } from "./admin.types.svelte";

class AdminState {
    public smtpSettings: SmtpSettings = $state({
        host: null,
        port: null,
        username: null,
        password: null,
        sender: null,
        enableSsl: false,
    });

    public users: User[] = $state([]);

    public clearState = () => {
        this.smtpSettings = {
            host: null,
            port: null,
            username: null,
            password: null,
            sender: null,
            enableSsl: false,
        };
        this.users = [];
    };
}

export const adminState = new AdminState();
