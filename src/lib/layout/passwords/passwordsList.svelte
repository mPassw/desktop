<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import passwords from "@/services/passwords.svelte";

	import { Badge } from "@/components/ui/badge";
	import { getDomainFromUrl } from "@/utils";
	import { GlobeLock } from "lucide-svelte";
	import type { Password } from "@/types";

	let {
		filteredPasswords,
		changeSelectedPassword,
	}: {
		filteredPasswords: Password[];
		changeSelectedPassword: (password: Password) => Promise<void>;
	} = $props();
</script>

<div class="flex flex-col w-1/2 overflow-auto h-fit max-h-full rounded-l-lg">
	{#each filteredPasswords as password, index}
		<button
			class="flex flex-col w-full gap-1.5 p-2 hover:bg-accent duration-75 {passwords
				.selectedPassword?.id === password.id
				? 'bg-accent'
				: ''} {index !== filteredPasswords.length - 1
				? 'border-b'
				: ''}"
			onclick={async () => {
				await changeSelectedPassword(password);
			}}
		>
			<div class="flex flex-row w-full items-center gap-1.5">
				<Avatar.Root>
					<Avatar.Image
						class="bg-muted-foreground"
						src={password.websites.length
							? `https://icons.duckduckgo.com/ip3/${getDomainFromUrl(password.websites[0])}.ico`
							: ""}
						alt="Icon"
					/>
					<Avatar.Fallback>
						<GlobeLock size={24} />
					</Avatar.Fallback>
				</Avatar.Root>
				<h2 class="text-lg w-full text-start truncate">
					{password.title}
				</h2>
			</div>
			{#if password.tags.length}
				<div class="flex flex-row gap-1.5 w-full flex-wrap">
					{#each password.tags as tag}
						<Badge variant="secondary">
							{tag}
						</Badge>
					{/each}
				</div>
			{/if}
		</button>
	{/each}
</div>
