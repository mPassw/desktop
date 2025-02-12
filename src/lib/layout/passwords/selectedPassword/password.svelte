<script lang="ts">
	import auth from "@/state/auth.svelte";
	import passwords from "@/state/passwords.svelte";
	import Icon from "@iconify/svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";

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
			bind:value={passwords.selectedPassword!.password!.value}
			readonly={auth.isOfflineMode || !passwords.isEditing}
			type={isPasswordRevealed ? "text" : "password"}
			placeholder="********"
		/>
		<div class="flex flex-row gap-1">
			<Button
				variant="outline"
				size="icon"
				onclick={() => (isPasswordRevealed = !isPasswordRevealed)}
			>
				<Icon
					icon={isPasswordRevealed ? "lucide:eye-off" : "lucide:eye"}
					font-size="20"
				/>
			</Button>
			<Button
				variant="outline"
				size="icon"
				disabled={!passwords.selectedPassword!.password.value}
				onclick={async () => {
					await copyText(passwords.selectedPassword!.password!.value);
				}}
			>
				<Icon icon="lucide:copy" font-size="20" />
			</Button>
		</div>
	</div>
</div>
