<script lang="ts">
	import Icon from "@iconify/svelte";

	import { Button } from "@/components/ui/button";
	import { getCurrentWindow } from "@tauri-apps/api/window";
</script>

<header class="w-full h-10 sticky bg-background top-0 left-0 z-50">
	<div class="w-full h-full flex justify-between items-center px-2">
		<div
			data-tauri-drag-region
			class="flex items-center gap-1.5 pointer-events-none select-none"
		></div>
		<div class="flex items-center gap-1.5">
			<Button
				variant="ghost"
				class="w-8 h-8"
				onclick={async () => await getCurrentWindow().minimize()}
			>
				<Icon icon="lucide:minimize-2" font-size="22" />
			</Button>
			<Button
				variant="ghost"
				class="w-8 h-8"
				onclick={async () => await getCurrentWindow().toggleMaximize()}
			>
				<Icon icon="lucide:maximize-2" font-size="22" />
			</Button>
			<Button
				variant="ghost"
				class="w-8 h-8"
				onclick={async () => await getCurrentWindow().close()}
			>
				<Icon icon="lucide:x" font-size="22" />
			</Button>
		</div>
	</div>
</header>
