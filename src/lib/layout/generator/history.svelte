<script lang="ts">
	import Icon from "@iconify/svelte";
	import passwordGenerator from "@/state/passwordGenerator.svelte";

	import type { HistoryItem } from "@/state/passwordGenerator.svelte";
	import { Blurfade } from "@/components/animations/blurfade";
	import { Button } from "@/components/ui/button";
	import { toast } from "svelte-sonner";

	let {
		history,
	}: {
		history: HistoryItem[];
	} = $props();

	const copyText = async (item: HistoryItem) => {
		try {
			if (item.encrypted) throw new Error("Cannot copy encrypted text");

			await navigator.clipboard.writeText(item.value);
			toast.success("Copied to clipboard");
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		}
	};

	const clearHistory = async () => {
		await passwordGenerator.clearHistory();
		history = [];
	};
</script>

<Blurfade class="flex flex-col w-full gap-1.5">
	<div>
		<Button onclick={clearHistory} variant="destructive">
			Clear History
		</Button>
	</div>
	{#each history as item}
		<button
			onclick={async () => await copyText(item)}
			class="flex flex-col w-full border border-input rounded-lg h-16 justify-center p-2 hover:bg-accent duration-75 relative"
		>
			{#if item.encrypted}
				<Icon
					icon="svg-spinners:3-dots-move"
					font-size="28"
					class="self-center"
				/>
			{:else}
				<Icon
					icon="lucide:copy"
					class="absolute right-2 top-2 opacity-50"
				/>
				<p class="truncate w-full text-start pr-4">{item.value}</p>
				<p class="text-muted-foreground text-sm text-start">
					{item.type}
				</p>
			{/if}
		</button>
	{/each}
</Blurfade>
