<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as Avatar from "$lib/components/ui/avatar";

	import authState from "@/services/auth.svelte";
	import auth from "@/services/auth.svelte";

	import { Button } from "../button";
	import { page } from "$app/state";
	import { Blurfade } from "@/components/animations/blurfade";
	import {
		ArrowBigUpDash,
		ArrowDownUp,
		ChevronDown,
		KeyRound,
		LogOut,
		RectangleEllipsis,
		Settings2,
		Trash2,
		User,
		Wrench,
	} from "lucide-svelte";
	import autoUpdate from "@/services/autoUpdate.svelte";
	import { Badge } from "../badge";
	import { goto } from "$app/navigation";

	let isUserMenuOpen: boolean = $state(false);
</script>

<Blurfade
	delay={0}
	class="w-1/5 max-w-[300px] h-full flex flex-col justify-between py-2 sticky"
>
	<div class="flex flex-col gap-1.5 items-start">
		<div class="flex flex-row items-center">
			<div
				class="w-[5px] h-[30px] bg-primary rounded-md {page.url
					.pathname === '/dashboard/passwords'
					? 'visible'
					: 'invisible'}"
			></div>
			<Button href="/dashboard/passwords" variant="link" class="text-lg">
				<RectangleEllipsis font-size="24" />
				<span> Passwords </span>
			</Button>
		</div>
		<div class="flex flex-row items-center">
			<div
				class="w-[5px] h-[30px] bg-primary rounded-md {page.url
					.pathname === '/dashboard/trash'
					? 'visible'
					: 'invisible'}"
			></div>
			<Button href="/dashboard/trash" variant="link" class="text-lg">
				<Trash2 font-size="24" />
				<span> Trash </span>
			</Button>
		</div>
		<div class="flex flex-row items-center">
			<div
				class="w-[5px] h-[30px] bg-primary rounded-md {page.url
					.pathname === '/dashboard/generator'
					? 'visible'
					: 'invisible'}"
			></div>
			<Button href="/dashboard/generator" variant="link" class="text-lg">
				<KeyRound font-size="24" />
				<span> Generator </span>
			</Button>
		</div>
		<div class="flex flex-row items-center">
			<div
				class="w-[5px] h-[30px] bg-primary rounded-md {page.url
					.pathname === '/dashboard/import-export'
					? 'visible'
					: 'invisible'}"
			></div>
			<Button
				href={auth.isOfflineMode ? "#" : "/dashboard/import-export"}
				variant="link"
				class="text-lg"
			>
				<ArrowDownUp font-size="24" />
				<span> Import/Export </span>
			</Button>
		</div>
	</div>

	<div class="flex flex-col gap-1.5 items-start">
		{#if autoUpdate.isUpdateAvailable}
			<Button
				variant="link"
				class="text-lg"
				onclick={() => (autoUpdate.isUpdateDialogOpen = true)}
			>
				<ArrowBigUpDash font-size="24" />
				Update
			</Button>
		{/if}
		<DropdownMenu.Root bind:open={isUserMenuOpen}>
			<DropdownMenu.Trigger
				class="w-full border border-input rounded-lg flex items-center justify-between px-2 py-1 gap-1.5 hover:bg-accent/50 duration-75"
			>
				<div class="flex items-center gap-1.5">
					<Avatar.Root>
						<Avatar.Fallback>
							{auth.username.length
								? auth.username.slice(0, 2).toUpperCase()
								: auth.email.slice(0, 2).toUpperCase()}
						</Avatar.Fallback>
					</Avatar.Root>
					<span class="truncate">
						{auth.username.length ? auth.username : auth.email}
					</span>
				</div>
				<span class="duration-150 {isUserMenuOpen ? 'rotate-180' : ''}">
					<ChevronDown size={16} />
				</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[var(--bits-dropdown-menu-anchor-width)]"
			>
				<DropdownMenu.Item
					onclick={async () => await goto("/dashboard/my-account")}
				>
					<User />
					Profile
				</DropdownMenu.Item>
				<DropdownMenu.Item
					onclick={async () => await goto("/dashboard/settings")}
				>
					<Settings2 />
					Settings
				</DropdownMenu.Item>
				{#if !auth.isOfflineMode && authState.isAdmin}
					<DropdownMenu.Item
						onclick={async () => await goto("/dashboard/admin")}
					>
						<Wrench />
						Admin
					</DropdownMenu.Item>
				{/if}
				<DropdownMenu.Item onclick={async () => await auth.logOut()}>
					<LogOut />
					Log Out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</Blurfade>
