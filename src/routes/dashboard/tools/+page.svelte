<script lang="ts">
    import Export from "$lib/components/layout/routes/tools/export.svelte";
    import Import from "$lib/components/layout/routes/tools/import.svelte";

    import { Separator } from "$lib/components/ui/separator";
</script>

<div class="flex flex-col gap-2 p-2">
    <Import />
    <Separator />
    <Export />
</div>
