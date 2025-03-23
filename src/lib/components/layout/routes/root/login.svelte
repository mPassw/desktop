<script lang="ts" module>
    import { z } from "zod";

    export const formSchema = z.object({
        email: z
            .string()
            .min(6, "Email or Username must be at least 6 characters"),
        password: z.string().min(8, "Password must be at least 8 characters"),
    });
    export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { toast } from "svelte-sonner";
    import { Button } from "$lib/components/ui/button";
    import { authState } from "$lib/modules/auth/auth.state.svelte";
    import { onMount } from "svelte";
    import { storageService } from "$lib/modules/storage/storage.service.svelte";
    import { blur } from "svelte/transition";
    import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";
    import { authService } from "$lib/modules/auth/auth.service.svelte";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { goto } from "$app/navigation";
    import { Eye, EyeOff } from "lucide-svelte";
    import { passwordsService } from "$lib/modules/passwords/passwords.service.svelte";

    let isPasswordRevealed: boolean = $state(false);

    let email: string = $state("");
    let password: string = $state("");

    const handleSubmit = async (event: Event) => {
        event.preventDefault();

        const result = formSchema.safeParse({ email, password });
        if (!result.success) {
            toast.error(result.error.errors[0].message);
            return;
        }

        try {
            loadersState.isFullscreenLoaderVisible = true;

            await authService.login(email, password);

            password = "";

            authState.currentAuthState = "loggedIn";
            await goto("/dashboard/passwords");
            await passwordsService.fetchPasswords();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message ?? "Unknown error");
        } finally {
            loadersState.isFullscreenLoaderVisible = false;
        }
    };

    onMount(async () => {
        email = (await storageService.getLastEmail()) ?? "";
    });
</script>

<div
    in:blur={{ duration: preferencesState.animationsDuration }}
    class="flex flex-col gap-1.5 justify-center items-center"
>
    <p class="text-xl tracking-tight font-medium">Login</p>
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
        <div class="flex gap-1.5 justify-end items-center w-full">
            <div class="flex gap-1.5 items-center">
                <Button
                    variant="link"
                    size="sm"
                    class="text-muted-foreground"
                    onclick={() => (authState.currentAuthState = "register")}
                >
                    Register
                </Button>
                <Button type="submit" size="sm">Login</Button>
            </div>
        </div>
        <div
            class="flex w-full justify-center items-center fixed bottom-0 left-0"
        >
            <Button
                variant="link"
                class="text-muted-foreground text-xs"
                onclick={() =>
                    (authState.currentAuthState = "serverValidation")}
            >
                Change Server URL
            </Button>
        </div>
    </form>
</div>
