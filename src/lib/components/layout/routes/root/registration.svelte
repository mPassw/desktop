<script lang="ts" module>
    import { z } from "zod";

    export const formSchema = z
        .object({
            email: z.string().email("Invalid email address"),
            username: z
                .string()
                .transform((val) => (val === "" ? undefined : val))
                .pipe(
                    z
                        .string()
                        .min(6, "Username must be at least 6 characters")
                        .max(64, "Username must be at most 64 characters")
                        .optional(),
                ),
            password: z
                .string()
                .min(8, "Password must be at least 8 characters")
                .refine(
                    (password) => /[0-9]/.test(password),
                    "Password must contain at least one number",
                )
                .refine(
                    (password) => /[^A-Za-z0-9]/.test(password),
                    "Password must contain at least one special character",
                ),
            repeatPassword: z
                .string()
                .min(8, "Password must be at least 8 characters"),
        })
        .refine((data) => data.password === data.repeatPassword, {
            message: "Passwords don't match",
            path: ["repeatPassword"],
        });
    export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";

    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { toast } from "svelte-sonner";
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import { authState } from "$lib/modules/auth/auth.state.svelte";
    import { blur } from "svelte/transition";
    import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";
    import { Eye, EyeOff } from "lucide-svelte";
    import { authService } from "$lib/modules/auth/auth.service.svelte";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";

    let email: string = $state("");
    let username: string = $state("");
    let password: string = $state("");
    let repeatPassword: string = $state("");

    let isPasswordRevealed: boolean = $state(false);
    let isConfirmationDialogOpen: boolean = $state(false);

    const handleSubmit = async (event: Event) => {
        event.preventDefault();

        const result = formSchema.safeParse({
            email,
            username,
            password,
            repeatPassword,
        });
        if (!result.success) {
            toast.error(result.error.errors[0].message);
            return;
        }

        if (!isConfirmationDialogOpen) {
            isConfirmationDialogOpen = true;
            return;
        }

        try {
            loadersState.isDialogLoaderVisible = true;

            await authService.register(
                email,
                username.length >= 6 ? username : null,
                password,
            );

            isConfirmationDialogOpen = false;
            authState.currentAuthState = "login";

            toast.success("Account created successfully");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };
</script>

<div
    in:blur={{ duration: preferencesState.animationsDuration }}
    class="flex flex-col gap-1.5 justify-center items-center"
>
    <p class="text-xl tracking-tight font-medium">Registration</p>
    <form onsubmit={handleSubmit} class="flex flex-col gap-2">
        <div class="flex w-full flex-col gap-1.5">
            <Label for="email">Email</Label>
            <Input
                bind:value={email}
                type="text"
                name="email"
                id="email"
                placeholder="mail@example.com"
            />
        </div>
        <div class="flex w-full flex-col gap-1.5">
            <Label for="username"
                >Username <span class="text-sm text-muted-foreground"
                    >(optional)</span
                ></Label
            >
            <Input
                bind:value={username}
                type="text"
                name="username"
                id="username"
                placeholder="coolname69240"
            />
        </div>
        <div class="flex w-full flex-col gap-1.5">
            <Label for="password">Password</Label>
            <Input
                bind:value={password}
                type={isPasswordRevealed ? "text" : "password"}
                name="password"
                id="password"
                placeholder="********"
                icon={isPasswordRevealed ? EyeOff : Eye}
                onClick={() => (isPasswordRevealed = !isPasswordRevealed)}
            />
        </div>
        <div class="flex w-full flex-col gap-1.5">
            <Label for="repeatPassword">Repeat Password</Label>
            <Input
                bind:value={repeatPassword}
                type={isPasswordRevealed ? "text" : "password"}
                name="repeatPassword"
                id="repeatPassword"
                placeholder="********"
            />
        </div>
        <div class="flex gap-1.5 justify-end items-center w-full">
            <div class="flex gap-1.5 items-center">
                <Button
                    variant="link"
                    size="sm"
                    class="text-muted-foreground"
                    onclick={() => (authState.currentAuthState = "login")}
                >
                    Login
                </Button>
                <Button type="submit" size="sm">Register</Button>
                <Dialog.Root bind:open={isConfirmationDialogOpen}>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Please read carefully</Dialog.Title>
                            <Dialog.Description>
                                While you can change your password once logged
                                in, there is no password recovery option. If you
                                lose your password, you will permanently lose
                                access to your account. Please make sure to
                                remember it and keep it in a safe place.
                            </Dialog.Description>
                        </Dialog.Header>
                        <Dialog.Footer>
                            <Dialog.Close
                                class={buttonVariants({ variant: "outline" })}
                            >
                                Cancel
                            </Dialog.Close>
                            <Button onclick={handleSubmit}>Register</Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Root>
            </div>
        </div>
    </form>
    <div class="flex w-full justify-center items-center fixed bottom-0 left-0">
        <Button
            variant="link"
            class="text-muted-foreground text-xs"
            onclick={() => (authState.currentAuthState = "serverValidation")}
        >
            Change Server URL
        </Button>
    </div>
</div>
