<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";

    import { Button, buttonVariants } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Eye, EyeOff, Pencil, PencilOff, Save } from "lucide-svelte";
    import { authState } from "$lib/modules/auth/auth.state.svelte";
    import { fade, slide } from "svelte/transition";
    import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";
    import { toast } from "svelte-sonner";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { authService } from "$lib/modules/auth/auth.service.svelte";
    import { httpService } from "$lib/modules/http/http.service.svelte";
    import { passwordsService } from "$lib/modules/passwords/passwords.service.svelte";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";

    let isEditing: boolean = $state(false);
    let isMasterPasswordRevealed: boolean = $state(false);
    let isNewPasswordRevealed: boolean = $state(false);

    let code: string = $state("");
    let newEmail: string = $state(authState.user!.email);
    let newUsername: string = $state(authState.user!.username ?? "");
    let newPassword: string = $state("");
    let repeatNewPassword: string = $state("");

    let masterPassword: string = $state("");

    const updateData = async () => {
        const currentEncryptionKey = passwordsState.encryptionKey;
        const currentSalt = passwordsState.salt;

        try {
            loadersState.isDialogLoaderVisible = true;

            if (
                !newEmail.length &&
                !newUsername.length &&
                !newPassword.length
            ) {
                throw new Error("At least one field must be filled");
            }

            if (!code.length) {
                throw new Error("Code is required");
            }

            if (newPassword.length) {
                if (newPassword !== repeatNewPassword) {
                    throw new Error("Passwords do not match");
                }

                if (newPassword.length < 8) {
                    throw new Error(
                        "Password must be at least 8 characters long",
                    );
                }
                if (!/\d/.test(newPassword)) {
                    throw new Error(
                        "Password must contain at least one number",
                    );
                }

                if (
                    !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
                ) {
                    throw new Error(
                        "Password must contain at least one special character",
                    );
                }
            }

            if (!(await passwordsService.isValidPassword(masterPassword))) {
                throw new Error("Invalid master password");
            }

            await authService.updateUserData(
                code,
                newEmail.length ? newEmail : null,
                newUsername.length ? newUsername : null,
                newPassword.length ? newPassword : null,
                masterPassword,
            );

            toast.success("Data updated successfully");
        } catch (err: any) {
            toast.error(err.message ?? "Unknown error");

            // reset the encryption key and salt to the previous values
            passwordsState.encryptionKey = currentEncryptionKey;
            passwordsState.salt = currentSalt;
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };

    const requestCode = async (): Promise<void> => {
        try {
            loadersState.isDialogLoaderVisible = true;

            await httpService.makeRequest("/smtp/@me?Type=AccountUpdate", {
                method: "GET",
                authorization: true,
            });

            toast.success("Code sent to your email");
        } catch (err: any) {
            toast.error(err.message ?? "Unknown error");
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };

    const cancelEditing = () => {
        isEditing = false;
        newEmail = authState.user!.email;
        newUsername = authState.user!.username ?? "";
        newPassword = "";
        repeatNewPassword = "";
    };
</script>

<div class="flex flex-col gap-1.5 w-full">
    <div class="flex gap-1.5 items-center">
        <p class="text-lg font-semibold tracking-tight leading-none">
            Personal Info
        </p>
        {#if !isEditing}
            <Button
                variant="outline"
                size="mini"
                onclick={() => (isEditing = true)}
            >
                <Pencil size={14} />
                Edit
            </Button>
        {:else}
            <Button
                variant="outline"
                size="mini"
                onclick={() => cancelEditing()}
            >
                <PencilOff size={14} />
                Cancel
            </Button>
            <Dialog.Root>
                <Dialog.Trigger
                    class={buttonVariants({ variant: "default", size: "mini" })}
                >
                    <Save size={14} />
                    Save
                </Dialog.Trigger>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>
                            Are you sure absolutely sure?
                        </Dialog.Title>
                        <Dialog.Description>
                            After saving changes, all your stored passwords will
                            be re-encrypted, your generator history will be
                            deleted, and you'll be automatically logged out. We
                            highly recommend exporting your passwords as a
                            backup beforehand to avoid any potential data loss.
                        </Dialog.Description>
                    </Dialog.Header>
                    <div class="flex w-full flex-col gap-1.5">
                        <Label for="master-password">Master Password</Label>
                        <Input
                            bind:value={masterPassword}
                            type={isMasterPasswordRevealed
                                ? "text"
                                : "password"}
                            id="master-password"
                            placeholder="Enter your master password"
                            icon={isMasterPasswordRevealed ? EyeOff : Eye}
                            onClick={() =>
                                (isMasterPasswordRevealed =
                                    !isMasterPasswordRevealed)}
                        />
                    </div>
                    <div class="flex w-full flex-col gap-1.5">
                        <Label for="code">Code</Label>
                        <Input
                            bind:value={code}
                            type="text"
                            id="code"
                            placeholder="Enter the code sent to your email"
                        />
                    </div>
                    <Dialog.Footer>
                        <Dialog.Close>
                            <Button variant="outline" size="sm">Cancel</Button>
                        </Dialog.Close>
                        <Button
                            variant="outline"
                            size="sm"
                            onclick={requestCode}
                        >
                            Request Code
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onclick={updateData}
                        >
                            Save
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Root>
        {/if}
    </div>
    <div class="flex gap-1.5 items-center w-full">
        <div class="flex w-1/2 flex-col gap-1.5">
            <Label for="email">Email</Label>
            <Input
                bind:value={newEmail}
                type="email"
                id="email"
                readonly={!isEditing}
                placeholder="mail@example.com"
            />
        </div>
        <div class="flex w-1/2 flex-col gap-1.5">
            <Label for="username">Username</Label>
            <Input
                bind:value={newUsername}
                type="text"
                id="username"
                readonly={!isEditing}
                placeholder="coolname69420"
            />
        </div>
    </div>

    {#if isEditing}
        <div
            transition:slide={{
                duration: preferencesState.animationsDuration,
            }}
            class="flex flex-col gap-1.5 w-full"
        >
            <div
                transition:fade={{
                    duration: preferencesState.animationsDuration,
                }}
                class="flex gap-1.5 items-center w-full"
            >
                <div class="flex w-1/2 flex-col gap-1.5">
                    <Label for="new-password">New Passwords</Label>
                    <Input
                        bind:value={newPassword}
                        type={isNewPasswordRevealed ? "text" : "password"}
                        id="new-password"
                        placeholder="*******"
                        icon={isNewPasswordRevealed ? EyeOff : Eye}
                        onClick={() =>
                            (isNewPasswordRevealed = !isNewPasswordRevealed)}
                    />
                </div>
                <div class="flex w-1/2 flex-col gap-1.5">
                    <Label for="repeat-new-password">Repeat New Password</Label>
                    <Input
                        bind:value={repeatNewPassword}
                        type={isNewPasswordRevealed ? "text" : "password"}
                        id="repeat-new-password"
                        placeholder="********"
                    />
                </div>
            </div>
            <div
                transition:fade={{
                    duration: preferencesState.animationsDuration,
                }}
                class="flex gap-1.5 w-full"
            >
                <p class="text-sm text-muted-foreground mt-1 text-pretty">
                    Update your personal information in the fields above. To
                    change your password, enter and confirm your new password in
                    both fields. If you want to keep your current password,
                    simply leave these fields empty
                </p>
            </div>
        </div>
    {/if}
</div>
