<script lang="ts">
	import loadersState from "@/state/loaders.svelte";
	import admin from "@/state/admin.svelte";
	import SmtpSettings from "@/layout/admin/smtpSettings.svelte";
	import UsersList from "@/layout/admin/usersList.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { Separator } from "@/components/ui/separator";
	import { onDestroy, onMount } from "svelte";
	import { Loader } from "@/components/animations/loaders";
	import { toast } from "svelte-sonner";

	onMount(async () => {
		try {
			loadersState.isAdminPageLoaderVisible = true;

			await admin.getSmtpSettings();
			await admin.getUsers();
		} catch (err: any) {
			toast.error(err.message ?? "Unknown error");
		} finally {
			loadersState.isAdminPageLoaderVisible = false;
		}
	});

	onDestroy(() => {
		admin.clearSmtpSettings();
		admin.clearUsers();
	});
</script>

<Blurfade
	class="p-3 flex flex-col w-full h-full gap-1.5 relative overflow-auto"
>
	{#if loadersState.isAdminPageLoaderVisible}
		<Loader />
	{:else}
		{#if loadersState.isAdminPageTransparentLoaderVisible}
			<Loader />
		{/if}
		<div class="flex flex-col gap-1.5 w-full">
			<SmtpSettings />
			<Separator class="my-1.5" />
			<UsersList />
		</div>
	{/if}
</Blurfade>
