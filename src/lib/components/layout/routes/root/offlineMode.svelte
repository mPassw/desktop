<script lang="ts" module>
    import { z } from "zod";

    export const formSchema = z.object({
        password: z.string().min(8, "Password must be at least 8 characters"),
    });
    export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Eye, EyeOff } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { toast } from "svelte-sonner";
    import { authState } from "$lib/modules/auth/auth.state.svelte";
    import { onMount } from "svelte";
    import { blur } from "svelte/transition";
    import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { goto } from "$app/navigation";
    import { passwordsService } from "$lib/modules/passwords/passwords.service.svelte";
    import { offlineModeService } from "$lib/modules/offlineMode/offlineMode.service.svelte";
    import { passwordsState } from "$lib/modules/passwords/passwords.state.svelte";

    let isPasswordRevealed: boolean = $state(false);
    let noOfflineModeData: boolean = $state(false);

    let email: string = $state("");
    let password: string = $state("");
    let createdAt: string = $state("");

    const handleSubmit = async (event: Event) => {
        event.preventDefault();

        const result = formSchema.safeParse({ email, password });
        if (!result.success) {
            toast.error(result.error.errors[0].message);
            return;
        }

        try {
            loadersState.isFullscreenLoaderVisible = true;

            if (!(await passwordsService.isValidPassword(password))) {
                throw new Error("Invalid password");
            }

            password = "";

            passwordsState.passwords = await offlineModeService.getPasswords();

            authState.currentAuthState = "offlineMode";

            await goto("/dashboard/passwords");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message ?? "Unknown error");
        } finally {
            loadersState.isFullscreenLoaderVisible = false;
        }
    };

    const getOfflineModeData = async () => {
        try {
            const data = await offlineModeService.getData();

            email = data.email;
            createdAt = new Date(data.createdAt).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
            passwordsState.encryptionKey = data.encryptionKey;
            passwordsState.salt = data.salt;
        } catch (err: any) {
            console.error(err);
            toast.error(err.message ?? "No offline mode data found");
            noOfflineModeData = true;
        }
    };

    onMount(async () => {
        await getOfflineModeData();
    });
</script>

<div
    in:blur={{ duration: preferencesState.animationsDuration }}
    class="flex flex-col gap-1.5 justify-center items-center w-[15.4rem]"
>
    <p class="text-xl tracking-tight font-medium">Offline Mode</p>
    {#if noOfflineModeData}
        <div class="flex flex-col">
            <p class="text-red-500 text-sm">No offline mode data found</p>
        </div>
    {:else}
        <form onsubmit={handleSubmit} class="flex flex-col gap-2">
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
                <Button type="submit" size="sm">Login</Button>
            </div>
        </form>
    {/if}
    <div
        class="flex flex-col w-full justify-center items-center fixed bottom-10 left-0"
    >
        <p class="text-xs text-muted-foreground">
            Logging in as <span class="font-medium">{email}</span>
        </p>
        <p class="text-xs text-muted-foreground border-b border-input">
            Last saved <span class="font-medium">{createdAt}</span>
        </p>
    </div>
    <div class="flex w-full justify-center items-center fixed bottom-0 left-0">
        <Button
            variant="link"
            class="text-muted-foreground text-xs"
            onclick={() => {
                authState.currentAuthState = "serverValidation";
                passwordsState.encryptionKey = new Uint8Array();
                passwordsState.salt = "";
            }}
        >
            Go to Online Mode
        </Button>
    </div>
</div>
