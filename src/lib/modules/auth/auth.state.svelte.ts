import type { User } from "./auth.types.svelte";

class AuthState {
    public currentAuthState:
        | "serverValidation"
        | "offlineLogin"
        | "login"
        | "register"
        | "loggedIn"
        | "offlineMode" = $state("serverValidation");

    public user: User | null = $state(null);
    public token: string = $state("");

    public pollingTimeoutId: number | null = null;

    // helpers
    public isOfflineMode: boolean = $derived(
        this.currentAuthState === "offlineLogin" ||
            this.currentAuthState === "offlineMode",
    );
    public isLoggedIn: boolean = $derived(
        this.currentAuthState === "loggedIn" ||
            this.currentAuthState === "offlineMode",
    );

    public clearState = () => {
        this.currentAuthState = "serverValidation";
        this.user = null;
        this.token = "";
        this.pollingTimeoutId = null;
    };
}

export const authState = new AuthState();
