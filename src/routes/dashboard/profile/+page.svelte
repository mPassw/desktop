<script lang="ts">
    import DangerZone from "$lib/components/layout/routes/profile/dangerZone.svelte";
    import PersonalInfo from "$lib/components/layout/routes/profile/personalInfo.svelte";

    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import { Separator } from "$lib/components/ui/separator";
</script>

<ScrollArea class="h-full">
    <div class="flex flex-col gap-2 w-full p-2">
        <PersonalInfo />
        <Separator />
        <DangerZone />
    </div>
</ScrollArea>
