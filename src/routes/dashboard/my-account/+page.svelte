<script lang="ts">
	import PersonalInfo from "@/layout/my-account/personalInfo.svelte";
	import UpdateData from "@/layout/my-account/updateData.svelte";
	import DangerZone from "@/layout/my-account/dangerZone.svelte";
	import auth from "@/services/auth.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { Separator } from "@/components/ui/separator";
	import { MailWarning } from "lucide-svelte";
</script>

<Blurfade
	class="p-3 flex flex-col w-full h-full gap-1.5 relative overflow-auto"
>
	{#if !auth.isVerified}
		<div
			class="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-50 backdrop-blur-sm"
		>
			<MailWarning size={32} />
			<p class="text-xl">Email not verified</p>
			<button
				class="text-sm text-muted-foreground hover:underline"
				onclick={() => (auth.isEmailVerificationDialogOpen = true)}
			>
				click to verify
			</button>
		</div>
	{/if}
	<div class:blur-sm={!auth.isVerified}>
		<PersonalInfo />
		<Separator class="my-2" />
		<UpdateData />
		<Separator class="my-2" />
		<DangerZone />
	</div>
</Blurfade>
