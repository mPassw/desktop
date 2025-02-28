<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs";
	import passwordGenerator, {
		type HistoryItem,
	} from "@/services/passwordGenerator.svelte";
	import auth from "@/services/auth.svelte";
	import Password from "@/layout/generator/password/password.svelte";
	import Username from "@/layout/generator/username/username.svelte";
	import History from "@/layout/generator/history.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { onMount } from "svelte";
	import { Button } from "@/components/ui/button";
	import { toast } from "svelte-sonner";
	import { Copy, RefreshCcw } from "lucide-svelte";

	let history: HistoryItem[] = $state([]);

	const copyPassword = async (): Promise<void> => {
		try {
			if (!passwordGenerator.generatedPassword.length) {
				throw new Error("No password generated");
			}

			await navigator.clipboard.writeText(
				passwordGenerator.generatedPassword
			);
			toast.success("Copied to clipboard");
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		}
	};

	const generate = async () => {
		try {
			if (passwordGenerator.type === "history") {
				await loadHistory();

				for (let item of history) {
					if (item.encrypted) {
						item = await passwordGenerator.decryptHistoryItem(item);
						item.encrypted = false;
					}
				}

				return;
			}

			history = [];
			passwordGenerator.isGenerating = true;
			await passwordGenerator.generate();
		} catch (err: any) {
			console.error(err);
			toast.error(err);
		} finally {
			passwordGenerator.isGenerating = false;
		}
	};

	const loadHistory = async () => {
		history = await passwordGenerator.loadHistory();
	};

	onMount(async () => {
		passwordGenerator.addressedEmailAddress = auth.email;

		await generate();
	});
</script>

<Blurfade
	class="p-3 flex flex-col w-full h-full gap-1.5 relative overflow-auto"
>
	<button
		onclick={copyPassword}
		class="w-full h-fit border border-input rounded-lg p-2 hover:bg-accent duration-75 relative"
	>
		<Copy size={16} class="absolute right-2 top-2 opacity-50" />
		{#each passwordGenerator.generatedPassword.split("") as char}
			{#if passwordGenerator.NUMBERSET.includes(char)}
				<span class="text-blue-500">{char}</span>
			{:else if passwordGenerator.SPECIALSET.includes(char)}
				<span class="text-red-500">{char}</span>
			{:else}
				<span>{char}</span>
			{/if}
		{/each}
	</button>
	<Tabs.Root
		bind:value={passwordGenerator.type}
		onValueChange={generate}
		class="w-full"
	>
		<Tabs.List class="w-full">
			<Tabs.Trigger
				value="password"
				class="w-1/3"
				disabled={passwordGenerator.isGenerating}
			>
				Password
			</Tabs.Trigger>
			<Tabs.Trigger
				value="username"
				class="w-1/3"
				disabled={passwordGenerator.isGenerating}
			>
				Username
			</Tabs.Trigger>
			<Tabs.Trigger
				value="history"
				class="w-1/3"
				disabled={passwordGenerator.isGenerating}
			>
				History
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="password">
			<Password />
		</Tabs.Content>
		<Tabs.Content value="username">
			<Username />
		</Tabs.Content>
		<Tabs.Content value="history">
			<History {history} />
		</Tabs.Content>
	</Tabs.Root>
	{#if passwordGenerator.type !== "history"}
		<div>
			<Button
				onclick={generate}
				size="sm"
				disabled={passwordGenerator.isGenerating}
				class="mt-3"
			>
				<RefreshCcw size={20} />
				Generate
			</Button>
		</div>
	{/if}
</Blurfade>
