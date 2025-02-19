<script>
	import Export from "@/layout/import-export/export.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { Separator } from "@/components/ui/separator";
</script>

<Blurfade
	class="p-3 flex flex-col w-full h-full gap-1.5 relative overflow-auto"
>
	<div class="flex flex-col">
		<div class="text-lg tracking-tight">Import</div>
		<p class="text-muted-foreground">Comming soon</p>
	</div>

	<Separator />
	<Export />
</Blurfade>
