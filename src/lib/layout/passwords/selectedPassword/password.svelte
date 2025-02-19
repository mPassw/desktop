<script lang="ts">
	import auth from "@/services/auth.svelte";
	import passwords from "@/services/passwords.svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Copy, Eye, EyeOff } from "lucide-svelte";

	let {
		isPasswordRevealed = $bindable(),
		copyText,
	}: {
		isPasswordRevealed: boolean;
		copyText: (text: string) => Promise<void>;
	} = $props();
</script>

<div class="flex flex-col gap-1">
	<h3 class="text-xl">Password</h3>
	<div class="flex flex-row items-center gap-1">
		<Input
			bind:value={passwords.selectedPassword!.password}
			readonly={auth.isOfflineMode || !passwords.isEditing}
			type={isPasswordRevealed ? "text" : "password"}
			placeholder="********"
		/>
		<div class="flex flex-row gap-1">
			<Button
				variant="outline"
				size="icon"
				onclick={() => (isPasswordRevealed = !isPasswordRevealed)}
				disabled={!passwords.selectedPassword!.password}
			>
				{#if isPasswordRevealed}
					<EyeOff size={20} />
				{:else}
					<Eye size={20} />
				{/if}
			</Button>
			<Button
				variant="outline"
				size="icon"
				disabled={!passwords.selectedPassword!.password}
				onclick={async () => {
					await copyText(passwords.selectedPassword!.password!);
				}}
			>
				<Copy size={20} />
			</Button>
		</div>
	</div>
</div>
