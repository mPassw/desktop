<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";

	import Loader from "@/components/animations/loaders/loader.svelte";
	import auth from "@/services/auth.svelte";
	import loadersState from "@/services/loaders.svelte";
	import admin from "@/services/admin.svelte";

	import { Button } from "@/components/ui/button";
	import { Users } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { Badge } from "@/components/ui/badge";

	const toggleUserVerification = async (id: string) => {
		try {
			loadersState.isDialogLoaderVisible = true;

			await admin.toggleUserVerification(id);
		} catch (err: any) {
			toast.error(err.message ?? "Unknown error");
		} finally {
			loadersState.isDialogLoaderVisible = false;
		}
	};

	const toggleUserAdminStatus = async (id: string) => {
		try {
			loadersState.isDialogLoaderVisible = true;

			await admin.toggleUserAdminStatus(id);
		} catch (err: any) {
			toast.error(err.message ?? "Unknown error");
		} finally {
			loadersState.isDialogLoaderVisible = false;
		}
	};
</script>

<div class="flex flex-row items-center gap-1">
	<Users size={20} />
	<p class="text-lg tracking-tight">Users</p>
</div>
<div class="flex flex-col w-full rounded-lg overflow-auto">
	{#each admin.users as user, index}
		<Dialog.Root>
			<Dialog.Trigger
				class="p-2 w-full hover:bg-accent/50 duration-75 {index !==
				admin.users.length - 1
					? 'border-b border-accent'
					: ''}"
			>
				<div class="flex flex-row items-center gap-1.5 w-full">
					<p class="w-1/3 truncate text-start">
						{user.email}
					</p>
					<p class="w-1/3">
						<Badge
							variant={user.admin ? "destructive" : "secondary"}
						>
							{user.admin ? "Admin" : "User"}
						</Badge>
					</p>
					<p class="w-1/3">
						<Badge
							variant={user.verified
								? "secondary"
								: "destructive"}
						>
							{user.verified ? "Verified" : "Not Verified"}
						</Badge>
					</p>
				</div>
			</Dialog.Trigger>
			<Dialog.Content class="overflow-y-auto min-h-fit max-h-[90%]">
				{#if loadersState.isDialogLoaderVisible}
					<Loader dark={true} />
				{/if}
				<div class="flex flex-row gap-1.5 select-none">
					<Badge
						variant={user.verified ? "secondary" : "destructive"}
					>
						{user.verified ? "Verified" : "Not Verified"}
					</Badge>
					<Badge variant="secondary">
						{user.admin ? "Admin" : "User"}
					</Badge>
				</div>
				<div class="flex flex-col select-none">
					<p class="text-lg leading-none">ID</p>
					<p class="text-muted-foreground">{user.id}</p>
				</div>
				<div class="flex flex-col select-none">
					<p class="text-lg leading-none">Email</p>
					<p class="text-muted-foreground">
						{user.email}
					</p>
				</div>
				<div class="flex flex-col select-none">
					<p class="text-lg leading-none">Username</p>
					<p class="text-muted-foreground">
						{user.username ?? "none"}
					</p>
				</div>
				<div class="flex flex-col select-none">
					<p class="text-lg leading-none">Passwords Saved</p>
					<p class="text-muted-foreground">
						{user.passwords}
					</p>
				</div>
				<Dialog.Footer class="select-none">
					<Button
						variant="secondary"
						disabled={auth.id === user.id}
						onclick={async () => {
							await toggleUserVerification(user.id);
						}}
					>
						{user.verified ? "Unverify" : "Verify"}
					</Button>
					<Button
						variant="secondary"
						disabled={auth.id === user.id}
						onclick={async () => {
							await toggleUserAdminStatus(user.id);
						}}
					>
						{user.admin ? "To User" : "To Admin"}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	{/each}
</div>
