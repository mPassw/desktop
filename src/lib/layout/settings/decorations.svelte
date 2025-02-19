<script lang="ts">
	import Apple from "@/assets/icons/apple.svelte";
	import Linux from "@/assets/icons/linux.svelte";
	import Windows from "@/assets/icons/windows.svelte";
	import MPass from "@/assets/mPass.svelte";
	import osInfo from "@/services/osInfo.svelte";
	import preferences from "@/services/preferences.svelte";

	import { Minus, Square, X } from "lucide-svelte";
</script>

<div class="flex flex-col w-full gap-1.5">
	<div>
		<h3>Window Decorations</h3>
		<div class="flex flex-row gap-1.5 w-full select-none">
			<button
				onclick={() => preferences.setWindowDecorations("system")}
				class="border rounded-lg w-1/3 h-screen max-h-36 bg-background items-start flex flex-col p-2 relative gap-1.5"
			>
				{#if preferences.windowDecorations === "system"}
					<div
						class="absolute top-2 right-2 w-4 h-4 flex items-center justify-center rounded-full bg-muted-foreground"
					></div>
				{/if}
				<p class="text-lg text-foreground font-semibold">System</p>
				{#if osInfo.os === "windows"}
					<Windows
						width={48}
						height={48}
						className="self-center h-full"
					/>
				{:else if osInfo.os === "linux"}
					<Linux
						width={48}
						height={48}
						className="self-center h-full"
					/>
				{:else}
					<Apple
						width={48}
						height={48}
						className="self-center h-full"
					/>
				{/if}
			</button>
			<button
				onclick={() => preferences.setWindowDecorations("custom")}
				class="border rounded-lg w-1/3 h-screen max-h-36 bg-background items-start flex flex-col p-2 relative gap-1.5"
			>
				{#if preferences.windowDecorations === "custom"}
					<div
						class="absolute top-2 right-2 w-4 h-4 flex items-center justify-center rounded-full bg-muted-foreground"
					></div>
				{/if}
				<p class="text-lg text-foreground font-semibold">Custom</p>
				<MPass width={64} height={64} className="self-center h-full" />
			</button>
			<button
				onclick={() => preferences.setWindowDecorations("off")}
				class="border rounded-lg w-1/3 h-screen max-h-36 bg-background items-start flex flex-col p-2 relative gap-1.5"
			>
				{#if preferences.windowDecorations === "off"}
					<div
						class="absolute top-2 right-2 w-4 h-4 flex items-center justify-center rounded-full bg-muted-foreground"
					></div>
				{/if}
				<p class="text-lg text-foreground font-semibold">None</p>
				<X class="self-center h-full" size={48} />
			</button>
		</div>
	</div>
	{#if preferences.windowDecorations === "custom"}
		<div class="flex flex-col w-full">
			<p>Side</p>
			<div class="flex flex-row gap-1.5">
				<button
					onclick={async () =>
						preferences.setWindowsDecorationsSide("left")}
					class="border rounded-lg w-1/2 h-screen max-h-36 items-start flex flex-col p-2 relative gap-1.5"
				>
					{#if preferences.windowDecorationsSide === "left"}
						<div
							class="absolute top-2 right-2 w-4 h-4 flex items-center justify-center rounded-full bg-muted-foreground"
						></div>
					{/if}
					<div
						class="flex flex-row gap-2 justify-start items-center w-full"
					>
						<X size={24} />
						<Minus size={20} />
						<Square size={16} />
					</div>
					<div class="w-1/3 h-4 bg-accent rounded-full"></div>
					<div class="w-1/5 h-4 bg-accent rounded-full"></div>
					<div class="w-1/4 h-4 bg-accent rounded-full"></div>
					<div class="w-1/2 h-4 bg-accent rounded-full"></div>
				</button>
				<button
					onclick={async () =>
						preferences.setWindowsDecorationsSide("right")}
					class="border rounded-lg w-1/2 h-screen max-h-36 items-start flex flex-col p-2 relative gap-1.5"
				>
					{#if preferences.windowDecorationsSide === "right"}
						<div
							class="absolute top-2 left-2 w-4 h-4 flex items-center justify-center rounded-full bg-muted-foreground"
						></div>
					{/if}
					<div
						class="flex flex-row gap-2 justify-end w-full items-center"
					>
						<Minus size={20} />
						<Square size={16} />
						<X size={24} />
					</div>
					<div class="w-1/3 h-4 bg-accent rounded-full"></div>
					<div class="w-1/5 h-4 bg-accent rounded-full"></div>
					<div class="w-1/4 h-4 bg-accent rounded-full"></div>
					<div class="w-1/2 h-4 bg-accent rounded-full"></div>
				</button>
			</div>
		</div>
	{/if}
</div>
