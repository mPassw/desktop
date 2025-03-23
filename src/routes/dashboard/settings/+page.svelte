<script lang="ts">
    import Theme from "$lib/components/layout/routes/settings/theme.svelte";
    import Animations from "$lib/components/layout/routes/settings/animations.svelte";
    import OsInfo from "$lib/components/layout/routes/settings/osInfo.svelte";
    import Icons from "$lib/components/layout/routes/settings/icons.svelte";
    import SessionDuration from "$lib/components/layout/routes/settings/sessionDuration.svelte";

    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import { Separator } from "$lib/components/ui/separator";
</script>

<ScrollArea class="h-full">
    <div class="flex flex-col gap-2 p-2">
        <Theme />
        <Separator />
        <Animations />
        <Icons />
        <SessionDuration />
        <Separator />
        <OsInfo />
    </div>
</ScrollArea>
