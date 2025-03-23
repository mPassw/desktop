<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";

    import { Button, buttonVariants } from "$lib/components/ui/button";
    import { adminState } from "$lib/modules/admin/admin.state.svelte";
    import { toast } from "svelte-sonner";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { adminService } from "$lib/modules/admin/admin.service.svelte";
    import { authState } from "$lib/modules/auth/auth.state.svelte";

    const toggleRole = async (userId: string) => {
        try {
            loadersState.isDialogLoaderVisible = true;

            await adminService.toggleUserRole(userId);

            toast.success("User role updated");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };

    const toggleVerification = async (userId: string) => {
        try {
            loadersState.isDialogLoaderVisible = true;

            await adminService.toggleUserVerified(userId);

            toast.success("User verification updated");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };
</script>

<div class="flex flex-col w-full gap-1.5">
    <p class="text-lg font-semibold tracking-tight">Users</p>
    <div class="grid grid-cols-2 gap-1.5">
        {#each adminState.users as user}
            <Dialog.Root>
                <Dialog.Trigger
                    class={buttonVariants({
                        variant: "outline",
                        class: "justify-start",
                    })}
                >
                    {user.email}
                </Dialog.Trigger>
                <Dialog.Content>
                    <div class="flex flex-col gap-3">
                        <div class="flex flex-col">
                            <p
                                class="text-lg tracking-tight font-semibold leading-none"
                            >
                                ID
                            </p>
                            <p class="text-muted-foreground">{user.id}</p>
                        </div>
                        <div class="flex flex-col">
                            <p
                                class="text-lg tracking-tight font-semibold leading-none"
                            >
                                Email
                            </p>
                            <p class="text-muted-foreground">{user.email}</p>
                        </div>
                        <div class="flex flex-col">
                            <p
                                class="text-lg tracking-tight font-semibold leading-none"
                            >
                                Username
                            </p>
                            <p class="text-muted-foreground">
                                {user.username?.length ? user.username : "none"}
                            </p>
                        </div>
                        <div class="flex flex-col">
                            <p
                                class="text-lg tracking-tight font-semibold leading-none"
                            >
                                Role
                            </p>
                            <p class="text-muted-foreground">
                                {user.admin ? "Admin" : "User"}
                            </p>
                        </div>
                        <div class="flex flex-col">
                            <p
                                class="text-lg tracking-tight font-semibold leading-none"
                            >
                                Vefified
                            </p>
                            <p class="text-muted-foreground">
                                {user.verified ? "Yes" : "No"}
                            </p>
                        </div>
                        <div class="flex flex-col">
                            <p
                                class="text-lg tracking-tight font-semibold leading-none"
                            >
                                Passwords saved
                            </p>
                            <p class="text-muted-foreground">
                                {user.passwords}
                            </p>
                        </div>
                    </div>
                    <Dialog.Footer>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={user.id === authState.user?.id}
                            onclick={async () => await toggleRole(user.id)}
                        >
                            {user.admin ? "To User" : "To Admin"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={user.id === authState.user?.id}
                            onclick={async () =>
                                await toggleVerification(user.id)}
                        >
                            {user.verified ? "Unverify" : "Verify"}
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Root>
        {/each}
    </div>
</div>
