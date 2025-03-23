<script lang="ts">
    import * as Resizable from "$lib/components/ui/resizable/index.js";

    import PasswordsList from "$lib/components/layout/routes/dashboard/passwords/passwordsList.svelte";
    import SelectedPassword from "$lib/components/layout/routes/dashboard/passwords/selectedPassword.svelte";

    import { ScrollArea } from "$lib/components/ui/scroll-area";
</script>

<Resizable.PaneGroup direction="horizontal" class="h-full w-full">
    <Resizable.Pane minSize={20} defaultSize={30}>
        <ScrollArea class="h-full">
            <PasswordsList />
        </ScrollArea>
    </Resizable.Pane>
    <Resizable.Handle withHandle />
    <Resizable.Pane minSize={50} defaultSize={70} class="p-2">
        <ScrollArea class="h-full pr-1">
            <SelectedPassword />
        </ScrollArea>
    </Resizable.Pane>
</Resizable.PaneGroup>
