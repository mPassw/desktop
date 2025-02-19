<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";

	import Loader from "@/components/animations/loaders/loader.svelte";
	import autoUpdate from "@/state/autoUpdate.svelte";
	import loadersState from "@/state/loaders.svelte";

	import { Button } from "@/components/ui/button";
</script>

<Dialog.Root bind:open={autoUpdate.isUpdateDialogOpen}>
	<Dialog.Content
		interactOutsideBehavior="ignore"
		escapeKeydownBehavior="ignore"
	>
		<Dialog.Header>
			<Dialog.Title>New Version Available</Dialog.Title>
		</Dialog.Header>
		{#if loadersState.isDialogLoaderVisible}
			<div
				class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-1.5"
			>
				<Loader dark={true} status={autoUpdate.currentUpdateStatus} />
			</div>
		{/if}
		<div class="flex flex-col gap-1 select-none">
			<p>
				A new version <span
					class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono"
					>{autoUpdate.availableVersion}</span
				> is ready to install. Would you like to update now?
			</p>
		</div>
		<Dialog.Footer>
			<Button
				variant="secondary"
				onclick={() => (autoUpdate.isUpdateDialogOpen = false)}
			>
				Remind Me Later
			</Button>
			<Button variant="default" onclick={async () => autoUpdate.update()}>
				Install Update
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
