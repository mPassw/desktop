<script lang="ts">
	import osInfo from "@/state/osInfo.svelte";
	import preferences from "@/state/preferences.svelte";
	import Icon from "@iconify/svelte";
</script>

<div class="flex flex-col w-full">
	<div class="flex flex-col">
		<h3>Window Decorations</h3>
	</div>
	<div class="flex flex-row gap-1.5 w-full select-none">
		<button
			onclick={() => preferences.setWindowDecorations("system")}
			class="border rounded-lg w-1/3 h-screen max-h-36 bg-background items-start flex flex-col p-2 relative gap-1.5"
		>
			<div
				class="absolute top-2 right-2 bg-muted-foreground w-4 h-4 rounded-lg flex items-center justify-center"
			>
				{#if preferences.windowDecorations === "system"}
					<div class="w-3 h-3 rounded-full bg-[#FBFBFB]"></div>
				{/if}
			</div>
			<p class="text-lg text-foreground font-semibold">System</p>
			<Icon
				icon={osInfo.os === "windows"
					? "simple-icons:windows"
					: osInfo.os === "linux"
						? "simple-icons:linux"
						: "simple-icons:apple"}
				font-size="48"
				class="self-center h-full"
			/>
		</button>
		<button
			onclick={() => preferences.setWindowDecorations("custom")}
			class="border rounded-lg w-1/3 h-screen max-h-36 bg-background items-start flex flex-col p-2 relative gap-1.5"
		>
			<div
				class="absolute top-2 right-2 bg-muted-foreground w-4 h-4 rounded-lg flex items-center justify-center"
			>
				{#if preferences.windowDecorations === "custom"}
					<div class="w-3 h-3 rounded-full bg-[#FBFBFB]"></div>
				{/if}
			</div>
			<p class="text-lg text-foreground font-semibold">Custom</p>
			<Icon
				icon="lucide:lock"
				font-size="48"
				class="self-center h-full"
			/>
		</button>
		<button
			onclick={() => preferences.setWindowDecorations("off")}
			class="border rounded-lg w-1/3 h-screen max-h-36 bg-background items-start flex flex-col p-2 relative gap-1.5"
		>
			<div
				class="absolute top-2 right-2 bg-muted-foreground w-4 h-4 rounded-lg flex items-center justify-center"
			>
				{#if preferences.windowDecorations === "off"}
					<div class="w-3 h-3 rounded-full bg-[#FBFBFB]"></div>
				{/if}
			</div>
			<p class="text-lg text-foreground font-semibold">None</p>
			<Icon icon="lucide:x" font-size="48" class="self-center h-full" />
		</button>
	</div>
</div>
