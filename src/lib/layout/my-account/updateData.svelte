<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs/index.js";

	import UpdateEmail from "./updateEmail.svelte";
</script>

<p class="text-lg">Update</p>
<Tabs.Root value="update-email" class="w-full">
	<Tabs.List class="w-full">
		<Tabs.Trigger value="update-email" class="w-1/3">Email</Tabs.Trigger>
		<Tabs.Trigger value="update-username" class="w-1/3"
			>Username</Tabs.Trigger
		>
		<Tabs.Trigger value="update-master-password" class="w-1/3">
			Master Password
		</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="update-email">
		<UpdateEmail />
	</Tabs.Content>
	<Tabs.Content value="update-username">
		<p>username</p>
	</Tabs.Content>
	<Tabs.Content value="update-master-password">
		<p>master password</p>
	</Tabs.Content>
</Tabs.Root>
