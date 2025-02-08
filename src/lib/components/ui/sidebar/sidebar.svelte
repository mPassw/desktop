<script lang="ts">
	import Icon from "@iconify/svelte";
	import authState from "@/state/auth.svelte";
	import auth from "@/state/auth.svelte";

	import { Button } from "../button";
	import { page } from "$app/state";
	import { Blurfade } from "@/components/animations/blurfade";

	const navigation = [
		{
			title: "Passwords",
			icon: "material-symbols:password",
			path: "/dashboard/passwords",
		},
		{
			title: "Trash",
			icon: "lucide:trash-2",
			path: "/dashboard/trash",
		},
		{
			title: "Generator",
			icon: "lucide:key-round",
			path: "/dashboard/generator",
		},
		{
			title: "Import/Export",
			icon: "lucide:arrow-down-up",
			path: "/dashboard/import-export",
		},
		{
			title: "My Account",
			icon: "lucide:user-round",
			path: "/dashboard/my-account",
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
				<Button href={item.path} variant="link" class="text-lg">
					<Icon icon={item.icon} font-size="24" />
					<span>
						{item.title}
					</span>
				</Button>
			</div>
		{/each}
	</div>

	<div class="flex flex-col gap-1.5 items-start">
		{#if authState.isAdmin}
			<div class="flex flex-row items-center">
				<div
					class="w-[5px] h-[30px] bg-primary rounded-md {page.url
						.pathname === '/dashboard/admin'
						? 'visible'
						: 'invisible'}"
				></div>
				<Button href="/dashboard/admin" variant="link" class="text-lg">
					<Icon icon="lucide:wrench" font-size="24" />
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
				<Icon icon="lucide:settings-2" font-size="24" />
				<span>Settings</span>
			</Button>
		</div>

		<div class="flex flex-row items-center ml-[5px]">
			<Button
				onclick={async () => await auth.logOut()}
				variant="link"
				class="text-lg"
			>
				<Icon icon="lucide:log-out" font-size="24" />
				<span>Log Out</span>
			</Button>
		</div>
	</div>
</Blurfade>
