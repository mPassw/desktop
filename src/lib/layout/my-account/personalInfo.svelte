<script lang="ts">
	import auth from "@/services/auth.svelte";
	import passwords from "@/services/passwords.svelte";
</script>

<p class="text-lg">Personal Info</p>
<div class="flex flex-row gap-1.5 w-full">
	<div class="flex flex-col w-1/2">
		<h1 class="text-lg tracking-tight leading-none">ID</h1>
		<p class="text-sm text-muted-foreground">{auth.id}</p>
	</div>
	<div class="flex flex-col w-1/2">
		<h1 class="text-lg tracking-tight leading-none">Email</h1>
		<p class="text-sm text-muted-foreground">{auth.email}</p>
	</div>
</div>

<div class="flex flex-row gap-1.5 w-full">
	<div class="flex flex-col w-1/2">
		<h1 class="text-lg tracking-tight leading-none">Passwords saved</h1>
		<p class="text-sm text-muted-foreground">
			{passwords.passwords.length}
		</p>
	</div>
	<div class="flex flex-col w-1/2">
		<h1 class="text-lg tracking-tight leading-none">Username</h1>
		<p class="text-sm text-muted-foreground">
			{auth.username.length ? auth.username : "none"}
		</p>
	</div>
</div>

<div class="flex flex-row gap-1.5 w-full">
	<div class="flex flex-col w-1/2">
		<h1 class="text-lg tracking-tight leading-none">Account Created</h1>
		<p class="text-sm text-muted-foreground">
			{new Date(auth.createdAt).toLocaleString()}
		</p>
	</div>
	<div class="flex flex-col w-1/2">
		<h1 class="text-lg tracking-tight leading-none">Last Updated</h1>
		<p class="text-muted-foreground">
			{new Date(auth.updatedAt).toLocaleString()}
		</p>
	</div>
</div>
