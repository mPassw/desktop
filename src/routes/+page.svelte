<script lang="ts">
    import Login from "$lib/components/layout/routes/root/login.svelte";
    import OfflineMode from "$lib/components/layout/routes/root/offlineMode.svelte";
    import Registration from "$lib/components/layout/routes/root/registration.svelte";
    import ServerValidation from "$lib/components/layout/routes/root/serverValidation.svelte";
    import MPass from "$lib/components/layout/svgs/mPass.svelte";

    import { authState } from "$lib/modules/auth/auth.state.svelte";
</script>

<div
    class="flex w-full h-screen items-center justify-center gap-24 overflow-hidden"
>
    <div class="flex flex-col gap-0 items-center">
        <MPass width={200} height={200} />
        <p class="text-3xl tracking-tight font-medium">mPass</p>
    </div>
    {#if authState.currentAuthState === "serverValidation"}
        <ServerValidation />
    {:else if authState.currentAuthState === "offlineLogin"}
        <OfflineMode />
    {:else if authState.currentAuthState === "login"}
        <Login />
    {:else if authState.currentAuthState === "register"}
        <Registration />
    {/if}
</div>
