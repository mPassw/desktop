<script lang="ts">
	import auth from "@/state/auth.svelte";
	import passwords from "@/state/passwords.svelte";
	import Icon from "@iconify/svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";

	let {
		copyText,
	}: {
		copyText: (text: string) => Promise<void>;
	} = $props();
</script>

<div class="flex flex-col gap-1">
	<h3 class="text-xl">Username</h3>
	<div class="flex flex-row items-center gap-1">
		<Input
			bind:value={passwords.selectedPassword!.username!.value}
			readonly={auth.isOfflineMode || !passwords.isEditing}
			type="text"
			placeholder="coolname123"
		/>
		<div>
			<Button
				variant="outline"
				size="icon"
				disabled={!passwords.selectedPassword!.username.value}
				onclick={async () => {
					await copyText(passwords.selectedPassword!.username!.value);
				}}
			>
				<Icon icon="lucide:copy" font-size="20" />
			</Button>
		</div>
	</div>
</div>
