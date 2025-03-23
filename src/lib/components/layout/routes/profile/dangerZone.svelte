<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";

    import { Button, buttonVariants } from "$lib/components/ui/button";
    import { Eye, EyeOff, ListX, UserMinus, UserX } from "lucide-svelte";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { toast } from "svelte-sonner";
    import { httpService } from "$lib/modules/http/http.service.svelte";
    import { authService } from "$lib/modules/auth/auth.service.svelte";
    import { passwordsService } from "$lib/modules/passwords/passwords.service.svelte";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";

    let isMasterPasswordRevealed: boolean = $state(false);

    let masterPassword: string = $state("");
    let code: string = $state("");

    const isValidPassword = async (): Promise<boolean> => {
        if (
            masterPassword.length < 8 ||
            !(await passwordsService.isValidPassword(masterPassword))
        )
            return false;

        return true;
    };

    const invalidateSessions = async () => {
        try {
            loadersState.isDialogLoaderVisible = true;

            if (!(await isValidPassword())) {
                toast.error("Invalid master password");
                return;
            }

            await httpService.makeRequest("/users/@me/sessions", {
                method: "POST",
                authorization: true,
            });

            await authService.logOut();

            toast.success("All sessions have been invalidated");
        } catch (err: any) {
            toast.error(err.message ?? "Unknown error");
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };

    const deleteAllPasswords = async () => {
        try {
            loadersState.isDialogLoaderVisible = true;

            if (code.length !== 6) {
                toast.error("Invalid code");
                return;
            }

            if (!(await isValidPassword())) {
                toast.error("Invalid master password");
                return;
            }

            await httpService.makeRequest(`/passwords/bulk?code=${code}`, {
                method: "DELETE",
                authorization: true,
            });

            passwordsState.passwords = [];

            toast.success("All passwords have been deleted");
        } catch (err: any) {
            toast.error(err.message ?? "Unknown error");
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };

    const getDeleteAllPasswordsCode = async () => {
        try {
            loadersState.isDialogLoaderVisible = true;

            await httpService.makeRequest("/smtp/@me?Type=DeleteAllPasswords", {
                method: "GET",
                authorization: true,
            });

            toast.success("Code has been sent to your email");
        } catch (err: any) {
            toast.error(err.message ?? "Unknown error");
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };

    const getDeleteProfileCode = async () => {
        try {
            loadersState.isDialogLoaderVisible = true;

            await httpService.makeRequest("/smtp/@me?Type=DeleteAccount", {
                method: "GET",
                authorization: true,
            });

            toast.success("Code has been sent to your email");
        } catch (err: any) {
            toast.error(err.message ?? "Unknown error");
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };
</script>

<div class="flex flex-col gap-1.5">
    <p class="text-lg font-semibold tracking-tight text-destructive">
        Danger Zone
    </p>
    <div class="flex w-full flex-wrap gap-1.5">
        <Dialog.Root
            onOpenChange={() => {
                isMasterPasswordRevealed = false;
                masterPassword = "";
                code = "";
            }}
        >
            <Dialog.Trigger
                class={buttonVariants({ variant: "destructive", size: "sm" })}
            >
                <UserMinus size={20} />
                Invalidate All Sessions
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
                    <Dialog.Description>
                        This action will invalidate all your sessions. You will
                        be logged out from all devices
                    </Dialog.Description>
                </Dialog.Header>
                <div class="flex flex-col gap-1.5">
                    <Label for="master-password">Master Password</Label>
                    <Input
                        type={isMasterPasswordRevealed ? "text" : "password"}
                        id="master-password"
                        bind:value={masterPassword}
                        placeholder="Enter your master password"
                        icon={isMasterPasswordRevealed ? EyeOff : Eye}
                        onClick={() =>
                            (isMasterPasswordRevealed =
                                !isMasterPasswordRevealed)}
                    />
                </div>
                <Dialog.Footer>
                    <Dialog.Close>
                        <Button variant="outline" size="sm">Cancel</Button>
                    </Dialog.Close>
                    <Button
                        variant="destructive"
                        size="sm"
                        onclick={invalidateSessions}>Confirm</Button
                    >
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>

        <Dialog.Root
            onOpenChange={() => {
                isMasterPasswordRevealed = false;
                masterPassword = "";
                code = "";
            }}
        >
            <Dialog.Trigger
                class={buttonVariants({ variant: "destructive", size: "sm" })}
            >
                <ListX size={20} />
                Delete All Passwords
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
                    <Dialog.Description>
                        This action is irreversible. All your passwords will be
                        deleted permanently
                    </Dialog.Description>
                </Dialog.Header>
                <div class="flex flex-col gap-1.5">
                    <Label for="master-password">Master Password</Label>
                    <Input
                        type={isMasterPasswordRevealed ? "text" : "password"}
                        id="master-password"
                        bind:value={masterPassword}
                        placeholder="Enter your master password"
                        icon={isMasterPasswordRevealed ? EyeOff : Eye}
                        onClick={() =>
                            (isMasterPasswordRevealed =
                                !isMasterPasswordRevealed)}
                    />
                </div>
                <div class="flex flex-col gap-1.5">
                    <Label for="code">Code</Label>
                    <Input
                        type="text"
                        id="code"
                        bind:value={code}
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
                        onclick={getDeleteAllPasswordsCode}>Request Code</Button
                    >
                    <Button
                        variant="destructive"
                        size="sm"
                        onclick={deleteAllPasswords}>Confirm</Button
                    >
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>

        <Dialog.Root
            onOpenChange={() => {
                isMasterPasswordRevealed = false;
                masterPassword = "";
                code = "";
            }}
        >
            <Dialog.Trigger
                class={buttonVariants({ variant: "destructive", size: "sm" })}
            >
                <UserX size={20} />
                Delete Profile
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
                    <Dialog.Description>
                        This action is irreversible. Your account will be
                        deleted permanently
                    </Dialog.Description>
                </Dialog.Header>
                <div class="flex flex-col gap-1.5">
                    <Label for="master-password">Master Password</Label>
                    <Input
                        type={isMasterPasswordRevealed ? "text" : "password"}
                        id="master-password"
                        bind:value={masterPassword}
                        placeholder="Enter your master password"
                        icon={isMasterPasswordRevealed ? EyeOff : Eye}
                        onClick={() =>
                            (isMasterPasswordRevealed =
                                !isMasterPasswordRevealed)}
                    />
                </div>
                <div class="flex flex-col gap-1.5">
                    <Label for="code">Code</Label>
                    <Input
                        type="text"
                        id="code"
                        bind:value={code}
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
                        onclick={getDeleteProfileCode}>Request Code</Button
                    >
                    <Button variant="destructive" size="sm" disabled>WIP</Button
                    >
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
    </div>
</div>
