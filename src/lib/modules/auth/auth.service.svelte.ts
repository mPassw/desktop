import { invoke } from "@tauri-apps/api/core";
import type {
    GenerateSaltAndVerifierResponse,
    GenerateSrpCredentialsResponse,
    LoginResponse1,
    LoginResponse2,
    User,
} from "./auth.types.svelte";
import { httpService } from "../http/http.service.svelte";
import { serverState } from "../server/server.state.svelte";
import { authState } from "./auth.state.svelte";
import { storageService } from "../storage/storage.service.svelte";
import { passwordsService } from "../passwords/passwords.service.svelte";
import { passwordsState } from "../passwords/passwords.state.svelte";
import { loadersState } from "../loaders/loaders.state.svelte";
import { goto } from "$app/navigation";
import { generatorState } from "../generator/generator.state.svelte";
import { preferencesState } from "../preferences/preferences.state.svelte";
import { generatorService } from "../generator/generator.service.svelte";

class AuthService {
    private readonly POLLING_INTERVAL = 10000;

    public register = async (
        email: string,
        username: string | null,
        password: string,
    ): Promise<void> => {
        const { salt, verifier } = await this.generateSaltAndVerifier(
            email,
            password,
        );

        await this._registerRequest(email, username, salt, verifier);
    };

    public login = async (
        identifier: string,
        password: string,
    ): Promise<void> => {
        const { authId, email, username, salt, b } =
            await this._loginRequest1(identifier);

        const { private_key, public_key } =
            await this._generateSrpCredentials();

        const m1 = await this._calculateSrpProof(
            private_key,
            email,
            password,
            salt,
            b,
        );

        const { m2, token } = await this._loginRequest2(authId, public_key, m1);

        authState.token = token;
        passwordsState.salt = salt;
        passwordsState.encryptionKey =
            await passwordsService.calculateEncryptionKey(password, salt);

        await storageService.setLastEmail(email);
        await this.getMe();

        this._startPolling();
    };

    public logOut = async (): Promise<void> => {
        authState.clearState();
        serverState.clearState();
        passwordsState.clearState();
        loadersState.clearState();
        generatorState.clearState();

        this._stopPolling();

        await goto("/");
    };

    public getMe = async (): Promise<void> => {
        const res = await httpService.makeRequest("/users/@me", {
            method: "GET",
            authorization: true,
        });

        authState.user = (await res.json()) as User;
    };

    public updateUserData = async (
        code: string,
        newEmail: string | null,
        newUsername: string | null,
        newPassword: string | null,
        masterPassword: string,
    ): Promise<void> => {
        code = code.trim();
        newEmail = newEmail?.trim() || null;
        newUsername = newUsername?.trim() || null;
        newPassword = newPassword?.trim() || null;

        const availability = await httpService.checkEmailUsernameAvailability(
            newEmail === authState.user!.email ? null : newEmail,
            newUsername === authState.user!.username ? null : newUsername,
        );

        console.log(availability);

        if (
            availability.isEmailAvailable !== null &&
            !availability.isEmailAvailable
        ) {
            throw new Error("Email is already taken");
        }

        if (
            availability.isUsernameAvailable !== null &&
            !availability.isUsernameAvailable
        ) {
            throw new Error("Username is already taken");
        }

        console.log("generating salt an verifier");

        const { salt, verifier } = await this.generateSaltAndVerifier(
            newEmail ?? authState.user!.email,
            newPassword ?? masterPassword,
        );

        console.log("decrypting all passwords");

        await passwordsService.decryptAllPasswords();

        passwordsState.encryptionKey =
            await passwordsService.calculateEncryptionKey(
                newPassword ?? masterPassword,
                salt,
            );

        console.log("encrypting all passwords");

        await passwordsService.encryptAllPasswords();

        console.log("sending request");

        await httpService.makeRequest("/users/@me", {
            method: "PATCH",
            authorization: true,
            body: JSON.stringify({
                code: code,
                email: newEmail,
                username:
                    newUsername === authState.user!.username
                        ? null
                        : newUsername,
                salt: salt,
                verifier: verifier,
                passwords: passwordsState.passwords.map((password) => ({
                    id: password.id,
                    title: password.title,
                    inTrash: password.inTrash,
                    username: password.username,
                    password: password.password,
                    note: password.note,
                    websites: password.websites,
                    tags: password.tags,
                })),
            }),
        });

        console.log("updating state");

        await generatorService.clearHistory();
        await this.logOut();
    };

    public generateSaltAndVerifier = async (
        email: string,
        password: string,
    ): Promise<GenerateSaltAndVerifierResponse> => {
        const salt = await invoke<string>("generate_salt");
        let verifier = await invoke<string>("generate_verifier", {
            email,
            password,
            salt,
        });

        // sometimes verifier length is 511
        while (verifier.length !== 512) {
            verifier = await invoke<string>("generate_verifier", {
                email,
                password,
                salt,
            });
        }

        return {
            salt,
            verifier,
        };
    };

    private _registerRequest = async (
        email: string,
        username: string | null,
        salt: string,
        verifier: string,
    ): Promise<void> => {
        await httpService.makeRequest("/users", {
            method: "POST",
            authorization: false,
            body: JSON.stringify({
                email,
                username,
                salt,
                verifier,
            }),
        });
    };

    private _loginRequest1 = async (
        identifier: string,
    ): Promise<LoginResponse1> => {
        const res = await httpService.makeRequest("/auth/step1", {
            method: "POST",
            authorization: false,
            body: JSON.stringify({
                identifier,
            }),
        });

        return (await res.json()) as LoginResponse1;
    };

    private _loginRequest2 = async (
        authId: string,
        a: string,
        m1: string,
    ): Promise<LoginResponse2> => {
        const res = await httpService.makeRequest("/auth/step2", {
            method: "POST",
            authorization: false,
            body: JSON.stringify({
                authId,
                a,
                m1,
                expiresIn: preferencesState.sessionDuration,
            }),
        });

        return (await res.json()) as LoginResponse2;
    };

    private _generateSrpCredentials =
        async (): Promise<GenerateSrpCredentialsResponse> =>
            await invoke<GenerateSrpCredentialsResponse>(
                "generate_srp_credentials",
            );

    private _calculateSrpProof = async (
        privateKey: string,
        email: string,
        password: string,
        salt: string,
        b: string,
    ): Promise<string> =>
        await invoke<string>("calculate_srp_proof", {
            privateKey: privateKey,
            email: email,
            password: password,
            salt: salt,
            serverB: b,
        });

    private _startPolling = (): void => {
        this._stopPolling();

        const poll = async () => {
            if (authState.token) {
                // will be enabled when we add settings
                // if (await getCurrentWindow().isFocused()) {
                //     await this.getMe();
                // }

                await this.getMe();

                authState.pollingTimeoutId = setTimeout(
                    poll,
                    this.POLLING_INTERVAL,
                );
            }
        };

        poll();
    };

    private _stopPolling = (): void => {
        if (authState.pollingTimeoutId) {
            clearTimeout(authState.pollingTimeoutId);
            authState.pollingTimeoutId = null;
        }
    };
}

export const authService = new AuthService();
