<script lang="ts">
	import { mode, setMode } from "mode-watcher";
</script>

<div class="flex flex-col w-full">
	<h3>Theme</h3>
	<div class="flex flex-row gap-1.5 w-full select-none">
		<button
			onclick={() => setMode("dark")}
			class="border rounded-lg w-1/2 h-screen max-h-36 bg-[#161718] items-start flex flex-col p-2 relative gap-1.5"
		>
			{#if $mode === "dark"}
				<div
					class="absolute top-2 right-2 w-4 h-4 flex items-center justify-center rounded-full bg-muted-foreground"
				></div>
			{/if}
			<p class="text-lg text-[#FBFBFB] font-semibold">Dark</p>
			<div class="w-1/3 h-4 bg-[#26272A] rounded-full"></div>
			<div class="w-1/5 h-4 bg-[#26272A] rounded-full"></div>
			<div class="w-1/4 h-4 bg-[#26272A] rounded-full"></div>
			<div class="w-1/2 h-4 bg-[#26272A] rounded-full"></div>
		</button>
		<button
			onclick={() => setMode("light")}
			class="border rounded-lg w-1/2 h-screen max-h-36 bg-[#FBFBFB] items-start flex flex-col p-2 relative gap-1.5"
		>
			{#if $mode === "light"}
				<div
					class="absolute top-2 right-2 w-4 h-4 flex items-center justify-center rounded-full bg-muted-foreground"
				></div>
			{/if}

			<p class="text-lg text-[#161718] font-semibold">Light</p>
			<div class="w-1/3 h-4 bg-[#F3EFEC] rounded-full"></div>
			<div class="w-1/5 h-4 bg-[#F3EFEC] rounded-full"></div>
			<div class="w-1/4 h-4 bg-[#F3EFEC] rounded-full"></div>
			<div class="w-1/2 h-4 bg-[#F3EFEC] rounded-full"></div>
		</button>
	</div>
</div>
