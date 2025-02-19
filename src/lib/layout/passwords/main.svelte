<script lang="ts">
	import auth from "@/services/auth.svelte";
	import passwords from "@/services/passwords.svelte";
	import Icon from "@iconify/svelte";
	import Search from "@/layout/passwords/search.svelte";
	import PasswordsList from "./passwordsList.svelte";
	import SelectedPassword from "./selectedPassword/selectedPassword.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { toast } from "svelte-sonner";
	import { Separator } from "@/components/ui/separator";
	import { saveOfflineModePasswords } from "@/offlineMode/offlineMode.svelte";
	import { page } from "$app/state";
	import { afterNavigate } from "$app/navigation";
	import { Loader } from "@/components/animations/loaders";
	import loadersState from "@/services/loaders.svelte";
	import type { Password } from "@/types";

	/**
	 * Since this component is used in two different pages, we need to check if the current page is the trash page
	 * because some features are not available in the trash page
	 */
	let isPageTrash: boolean = $derived(
		page.url.pathname === "/dashboard/trash"
	);
	let isDecrypting: boolean = $state(true);
	let searchValue: string = $state("");

	let filteredPasswords: Password[] = $derived(
		passwords.passwords.filter((password) => {
			return (
				(isPageTrash ? password.inTrash : !password.inTrash) &&
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
			loadersState.isPasswordsLoaderVisible = true;

			await passwords.getPasswords(isPageTrash);
			await saveOfflineModePasswords(passwords.passwords);
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			loadersState.isPasswordsLoaderVisible = false;
		}
	};

	const changeSelectedPassword = async (password: Password) => {
		if (passwords.selectedPassword?.id === password.id) return;
		try {
			isDecrypting = true;
			await passwords.setSelectedPassword(password);
		} catch (err: any) {
			toast.error(err.message ?? "Unknown error");
		} finally {
			isDecrypting = false;
		}
	};

	afterNavigate(async () => {
		try {
			if (!passwords.passwords.length) {
				await fetchPasswords();
				return;
			}

			let passwordToSelect: Password | null = null;

			if (isPageTrash) {
				passwordToSelect =
					passwords.passwords.find((password) => password.inTrash) ??
					null;
			} else {
				passwordToSelect =
					passwords.passwords.find((password) => !password.inTrash) ??
					null;
			}

			if (passwordToSelect) {
				await changeSelectedPassword(passwordToSelect);
			}
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			isDecrypting = false;
			loadersState.isPasswordsLoaderVisible = false;
		}
	});
</script>

<Blurfade
	delay={0}
	class="p-3 flex flex-col w-full h-full gap-1.5 relative overflow-x-hidden"
>
	{#if loadersState.isPasswordsLoaderVisible}
		<Loader />
	{:else}
		{#if !auth.isOfflineMode && !auth.isVerified}
			<p>Email not verified mate</p>
		{/if}
		<Search bind:searchValue {isPageTrash} {fetchPasswords} />
		{#if !filteredPasswords.length}
			<div class="flex gap-1 w-full justify-center h-full items-center">
				<Icon icon="lucide:info" font-size="24" />
				<p class="text-center text-lg">No Passwords Found</p>
			</div>
		{:else}
			<div class="flex flex-row w-full h-full mt-12 overflow-auto">
				<PasswordsList {filteredPasswords} {changeSelectedPassword} />
				<Separator orientation="vertical" />
				<SelectedPassword bind:isDecrypting {isPageTrash} />
			</div>
		{/if}
	{/if}
</Blurfade>
