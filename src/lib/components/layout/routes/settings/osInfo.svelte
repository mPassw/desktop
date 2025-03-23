<script lang="ts">
    import { serverState } from "$lib/modules/server/server.state.svelte";
    import { systemInformationState } from "$lib/modules/systemInformation/systemInformation.state.svelte";
</script>

<div class="flex flex-col gap-1.5">
    <!-- <p class="text-lg font-semibold tracking-tight">Other</p> -->
    <div class="flex flex-col">
        <p class="leading-none text-sm">Server Version</p>
        <p class="text-muted-foreground text-xs">{serverState.serverVersion}</p>
    </div>
    <div class="flex flex-col">
        <p class="leading-none text-sm">App Version</p>
        <p class="text-muted-foreground text-xs">
            {systemInformationState.appVersion}
        </p>
    </div>
    <div class="flex flex-col">
        <p class="leading-none text-sm">Running on</p>
        <p class="text-muted-foreground text-xs">
            {systemInformationState.platform}
            {systemInformationState.version} ({systemInformationState.arch})
        </p>
    </div>
</div>
