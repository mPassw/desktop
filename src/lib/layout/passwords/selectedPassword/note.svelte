<script lang="ts">
	import auth from "@/state/auth.svelte";
	import passwords from "@/state/passwords.svelte";
	import Icon from "@iconify/svelte";

	import { Button } from "@/components/ui/button";
	import { Textarea } from "@/components/ui/textarea";

	let {
		copyText,
		autoResize,
	}: {
		copyText: (text: string) => Promise<void>;
		autoResize: (e: any) => void;
	} = $props();
</script>

<div class="flex flex-col gap-1">
	<h3 class="text-xl">Note</h3>
	{#if passwords.selectedPassword}
		<div class="flex flex-row items-start gap-1">
			<Textarea
				bind:value={passwords.selectedPassword.note}
				readonly={auth.isOfflineMode || !passwords.isEditing}
				placeholder="Empty..."
				maxlength={64}
				oninput={autoResize}
				class="min-h-fit"
			/>
			<div class="flex flex-col gap-1">
				<Button
					variant="outline"
					size="icon"
					disabled={!passwords.selectedPassword.note}
					onclick={async () => {
						await copyText(passwords.selectedPassword!.note!);
					}}
				>
					<Icon icon="lucide:copy" font-size="20" />
				</Button>
			</div>
		</div>
	{/if}
</div>
