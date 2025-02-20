<script lang="ts">
	import auth from "@/services/auth.svelte";
	import autoUpdate from "@/services/autoUpdate.svelte";
	import osInfo from "@/services/osInfo.svelte";
	import server from "@/services/server.svelte";
</script>

<div class="flex flex-col w-full">
	<div class="flex flex-col gap-1.5">
		<div class="flex flex-col">
			<h3 class="leading-none">App Version</h3>
			<p class="text-muted-foreground">
				{osInfo.appVersion}
				{#if osInfo.os === "windows"}
					<button
						class="text-muted-foreground hover:underline"
						onclick={async () =>
							await autoUpdate.checkForUpdates(true)}
					>
						check for updates
					</button>
				{/if}
			</p>
		</div>
		<div class="flex flex-col">
			<h3 class="leading-none">Server Version</h3>
			<p class="text-muted-foreground">
				{auth.isOfflineMode
					? "offline-mode"
					: (server.serverVersion ?? undefined)}
			</p>
		</div>
		<div class="flex flex-col">
			<h3 class="leading-none">Operating System Type</h3>
			<p class="text-muted-foreground">{osInfo.os}</p>
		</div>
		<div class="flex flex-col">
			<h3 class="leading-none">Version</h3>
			<p class="text-muted-foreground">{osInfo.version}</p>
		</div>
		<div class="flex flex-col">
			<h3 class="leading-none">Arch</h3>
			<p class="text-muted-foreground">{osInfo.arch}</p>
		</div>
		<div class="flex flex-col">
			<h3 class="leading-none">Hostname</h3>
			<p class="text-muted-foreground">{osInfo.hostname}</p>
		</div>
	</div>
</div>
