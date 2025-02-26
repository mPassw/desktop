<script lang="ts">
	import authState from "@/services/auth.svelte";
	import auth from "@/services/auth.svelte";

	import { Button } from "../button";
	import { page } from "$app/state";
	import { Blurfade } from "@/components/animations/blurfade";
	import {
		ArrowDownUp,
		ArrowUp,
		CircleFadingArrowUp,
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

	const navigation = [
		{
			title: "Passwords",
			icon: RectangleEllipsis,
			path: "/dashboard/passwords",
		},
		{
			title: "Trash",
			icon: Trash2,
			path: "/dashboard/trash",
		},
		{
			title: "Generator",
			icon: KeyRound,
			path: "/dashboard/generator",
			disabled: auth.isOfflineMode,
		},
		{
			title: "Import/Export",
			icon: ArrowDownUp,
			path: "/dashboard/import-export",
			disabled: auth.isOfflineMode,
		},
		{
			title: "My Account",
			icon: User,
			path: "/dashboard/my-account",
			disabled: auth.isOfflineMode,
			badge: "!",
			badgeCondition: !authState.isVerified,
		},
	];
</script>

<Blurfade
	delay={0}
	class="w-1/5 max-w-[300px] h-full flex flex-col justify-between py-2 sticky"
>
	<div class="flex flex-col gap-1.5 items-start">
		{#each navigation as item}
			<div class="flex flex-row items-center">
				<div
					class="w-[5px] h-[30px] bg-primary rounded-md {page.url
						.pathname === item.path
						? 'visible'
						: 'invisible'}"
				></div>
				<Button
					href={item.disabled ? "#" : item.path}
					variant="link"
					class="text-lg {item.disabled
						? 'pointer-events-none text-muted-foreground'
						: ''}"
				>
					<item.icon font-size="24" />
					<span>
						{item.title}
					</span>
					{#if item.badge && item.badgeCondition}
						<Badge variant="secondary">
							{item.badge}
						</Badge>
					{/if}
				</Button>
			</div>
		{/each}
	</div>

	<div class="flex flex-col gap-1.5 items-start">
		{#if autoUpdate.isUpdateAvailable}
			<div class="flex flex-row items-center ml-[5px]">
				<Button
					onclick={() => (autoUpdate.isUpdateDialogOpen = true)}
					variant="link"
					class="text-lg"
				>
					<CircleFadingArrowUp size={24} />
					<span>Update</span>
				</Button>
			</div>
		{/if}

		{#if authState.isAdmin}
			<div class="flex flex-row items-center">
				<div
					class="w-[5px] h-[30px] bg-primary rounded-md {page.url
						.pathname === '/dashboard/admin'
						? 'visible'
						: 'invisible'}"
				></div>
				<Button href="/dashboard/admin" variant="link" class="text-lg">
					<Wrench size={24} />
					<span>Admin</span>
				</Button>
			</div>
		{/if}

		<div class="flex flex-row items-center">
			<div
				class="w-[5px] h-[30px] bg-primary rounded-md {page.url
					.pathname === '/dashboard/settings'
					? 'visible'
					: 'invisible'}"
			></div>
			<Button href="/dashboard/settings" variant="link" class="text-lg">
				<Settings2 size={24} />
				<span>Settings</span>
			</Button>
		</div>

		<div class="flex flex-row items-center ml-[5px]">
			<Button
				onclick={async () => await auth.logOut()}
				variant="link"
				class="text-lg"
			>
				<LogOut size={24} />
				<span>Log Out</span>
			</Button>
		</div>
	</div>
</Blurfade>
