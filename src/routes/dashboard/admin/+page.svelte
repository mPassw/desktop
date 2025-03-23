<script lang="ts">
    import SmtpSettings from "$lib/components/layout/routes/admin/smtpSettings.svelte";
    import UsersList from "$lib/components/layout/routes/admin/usersList.svelte";

    import { goto } from "$app/navigation";
    import { Separator } from "$lib/components/ui/separator";
    import { authState } from "$lib/modules/auth/auth.state.svelte";
    import { onDestroy, onMount } from "svelte";
    import { adminService } from "$lib/modules/admin/admin.service.svelte";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { toast } from "svelte-sonner";
    import { adminState } from "$lib/modules/admin/admin.state.svelte";
    import { ScrollArea } from "$lib/components/ui/scroll-area";

    const loadSettings = async () => {
        try {
            loadersState.isFullscreenLoaderVisible = true;
            await adminService.getSmtpSettings();
            await adminService.getUsers();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            loadersState.isFullscreenLoaderVisible = false;
        }
    };

    onMount(async () => {
        if (!authState.user?.admin) {
            await goto("/");
            return;
        }

        await loadSettings();
    });

    onDestroy(() => {
        adminState.clearState();
    });
</script>

<ScrollArea class="h-full">
    <div class="flex flex-col gap-2 w-full p-2">
        <SmtpSettings />
        <Separator />
        <UsersList />
    </div>
</ScrollArea>
