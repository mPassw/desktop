<script lang="ts">
	import preferences from "@/services/preferences.svelte";

	import { Button } from "@/components/ui/button";
	import { getCurrentWindow } from "@tauri-apps/api/window";
	import { Minus, Square, X } from "lucide-svelte";
</script>

<header class="w-full h-8 sticky bg-background top-0 left-0 z-50">
	<div class="w-full h-full flex justify-between items-center px-2">
		{#if preferences.windowDecorationsSide === "left"}
			<div class="flex items-center gap-1.5">
				<Button
					variant="ghost"
					class="w-8 h-8"
					onclick={async () => await getCurrentWindow().close()}
				>
					<X size={22} />
				</Button>
				<Button
					variant="ghost"
					class="w-8 h-8"
					onclick={async () => await getCurrentWindow().minimize()}
				>
					<Minus size={22} />
				</Button>
				<Button
					variant="ghost"
					class="w-8 h-8"
					onclick={async () =>
						await getCurrentWindow().toggleMaximize()}
				>
					<Square size={16} />
				</Button>
			</div>
		{/if}
		<div
			tabindex="0"
			role="button"
			onmousedown={(e) => {
				const appWindow = getCurrentWindow();
				if (e.buttons === 1) {
					e.detail === 2
						? appWindow.toggleMaximize()
						: appWindow.startDragging();
				}
			}}
			class="flex items-center gap-1.5 select-none w-full h-full cursor-default"
		></div>
		{#if preferences.windowDecorationsSide === "right"}
			<div class="flex items-center gap-1.5">
				<Button
					variant="ghost"
					class="w-8 h-8"
					onclick={async () => await getCurrentWindow().minimize()}
				>
					<Minus size={22} />
				</Button>
				<Button
					variant="ghost"
					class="w-8 h-8"
					onclick={async () =>
						await getCurrentWindow().toggleMaximize()}
				>
					<Square size={16} />
				</Button>
				<Button
					variant="ghost"
					class="w-8 h-8"
					onclick={async () => await getCurrentWindow().close()}
				>
					<X size={22} />
				</Button>
			</div>
		{/if}
	</div>
</header>
