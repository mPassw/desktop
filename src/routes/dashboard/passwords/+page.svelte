<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar";
	import auth from "@/state/auth.svelte";
	import passwords, { type Password } from "@/state/passwords.svelte";
	import Icon from "@iconify/svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { Badge } from "@/components/ui/badge";
	import { onMount } from "svelte";
	import { Input } from "@/components/ui/input";
	import { Button } from "@/components/ui/button";
	import { toast } from "svelte-sonner";
	import { Separator } from "@/components/ui/separator";
	import { saveOfflineModePasswords } from "@/offlineMode/offlineMode.svelte";

	let isLoading: boolean = $state(true);
	let searchValue: string = $state("");

	let filteredPasswords: Password[] = $derived(
		passwords.passwords.filter((password) => {
			return (
				!password.inTrash &&
				(password.title
					.toLowerCase()
					.includes(searchValue.toLowerCase()) ||
					password.websites.some((website) =>
						website
							.toLowerCase()
							.includes(searchValue.toLowerCase())
					) ||
					password.tags.some((tag) =>
						tag.toLowerCase().includes(searchValue.toLowerCase())
					))
			);
		})
	);

	const fetchPasswords = async () => {
		try {
			isLoading = true;

			await passwords.getPasswords();
			await saveOfflineModePasswords(passwords.passwords);
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			isLoading = false;
		}
	};

	onMount(async () => {
		try {
			if (!passwords.passwords.length) {
				await fetchPasswords();
			}
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			isLoading = false;
		}
	});
</script>

<Blurfade
	class="p-3 flex flex-col w-full h-full gap-1.5 relative overflow-x-hidden"
>
	{#if isLoading}
		<Icon
			icon="svg-spinners:3-dots-move"
			font-size="64"
			class="self-center justify-self-center h-full"
		/>
	{:else}
		{#if !auth.isOfflineMode && !auth.isVerified}
			<p>Email not verified mate</p>
		{/if}
		<div
			class="flex flex-row items-center gap-1.5 w-full absolute top-3 pr-6"
		>
			<Input
				bind:value={searchValue}
				placeholder="Search by Title, Website or Tag"
			/>
			<div class="flex flex-row gap-1.5">
				<Button variant="outline" size="icon">
					<Icon icon="lucide:plus" font-size="20" />
				</Button>
				<Button variant="outline" size="icon" onclick={fetchPasswords}>
					<Icon icon="lucide:refresh-cw" font-size="20" />
				</Button>
			</div>
		</div>
		{#if !filteredPasswords.length}
			<div class="flex gap-1 w-full justify-center h-full items-center">
				<Icon icon="lucide:info" font-size="24" />
				<p class="text-center text-lg">No Passwords Found</p>
			</div>
		{:else}
			<div
				class="flex flex-row w-full h-full mt-12 rounded-lg overflow-auto"
			>
				<div class="flex flex-col w-1/2 overflow-auto h-fit max-h-full">
					{#each filteredPasswords as password, index}
						<button
							class="flex flex-col w-full gap-1.5 p-2 hover:bg-accent {passwords.selectedPassword ===
							password
								? 'bg-accent'
								: ''} {index !== filteredPasswords.length - 1
								? 'border-b'
								: ''}"
							onclick={() => {
								passwords.selectedPassword = password;
							}}
						>
							<div
								class="flex flex-row w-full items-center gap-1.5"
							>
								<Avatar.Root>
									<Avatar.Image
										src={password.websites.length
											? `https://icons.duckduckgo.com/ip3/${URL.parse(password.websites[0])?.hostname}.ico`
											: ""}
										alt="Passord Icon"
									/>
									<Avatar.Fallback>
										<Icon
											icon="lucide:globe-lock"
											font-size="24"
										/>
									</Avatar.Fallback>
								</Avatar.Root>
								<h2 class="text-lg w-full text-start truncate">
									{password.title}
								</h2>
							</div>
							{#if password.tags.length}
								<div
									class="flex flex-row gap-1.5 w-full flex-wrap"
								>
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
				<Separator orientation="vertical" />
				<div
					class="w-1/2 flex flex-col gap-1.5 overflow-auto h-fit max-h-full p-2"
				>
					<div class="flex flex-row gap-1.5 justify-start">
						<Button
							variant="secondary"
							size="sm"
							disabled={auth.isOfflineMode}
						>
							<Icon icon="lucide:pencil" font-size="20" />
							Edit
						</Button>
						<Button
							variant="destructive"
							size="sm"
							disabled={auth.isOfflineMode}
						>
							<Icon icon="lucide:trash-2" font-size="20" />
							Trash
						</Button>
					</div>
					<div class="flex flex-col">
						<h3 class="text-xl">Title</h3>
						<Input
							bind:value={passwords.selectedPassword!.title}
							readonly={auth.isOfflineMode ||
								!passwords.isEditing}
						/>
					</div>
					<p>{passwords.selectedPassword!.username?.value}</p>
					<p>{passwords.selectedPassword!.password?.value}</p>
					<p>{passwords.selectedPassword!.note?.value}</p>
					<p>{passwords.selectedPassword!.createdAt}</p>
					<p>{passwords.selectedPassword!.updatedAt}</p>
				</div>
			</div>
		{/if}
	{/if}
</Blurfade>
