<script lang="ts" module>
	import { z } from "zod";

	export const formSchema = z.object({
		url: z.string().url(),
	});
	export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import { toast } from "svelte-sonner";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { serverService } from "$lib/modules/server/server.service.svelte";
	import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
	import { authState } from "$lib/modules/auth/auth.state.svelte";
	import { onMount } from "svelte";
	import { storageService } from "$lib/modules/storage/storage.service.svelte";
	import { blur } from "svelte/transition";
	import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";

	let url: string = $state("");

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		const result = formSchema.safeParse({ url });
		if (!result.success) {
			toast.error("Invalid URL");
			return;
		}

		try {
			loadersState.isFullscreenLoaderVisible = true;

			await serverService.checkServer(url);

			authState.currentAuthState = "login";
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			loadersState.isFullscreenLoaderVisible = false;
		}
	};

	onMount(async () => {
		url = (await storageService.getLastServerUrl()) ?? "";
	});
</script>

<div
	in:blur={{ duration: preferencesState.animationsDuration }}
	class="flex flex-col gap-1.5 justify-center items-center"
>
	<p class="tracking-tight font-medium">Enter your instance URL</p>
	<form onsubmit={handleSubmit} class="flex flex-col gap-2">
		<Input
			type="url"
			name="url"
			bind:value={url}
			placeholder="https://example.com"
		/>
		<div class="flex gap-1.5 justify-end items-center w-full">
			<Button
				variant="link"
				size="sm"
				class="text-muted-foreground"
				onclick={() => (authState.currentAuthState = "offlineLogin")}
			>
				Offline mode
			</Button>
			<Button type="submit" size="sm">Next</Button>
		</div>
	</form>
</div>
