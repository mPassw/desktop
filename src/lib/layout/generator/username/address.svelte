<script lang="ts">
	import passwordGenerator from "@/services/passwordGenerator.svelte";

	import { Input } from "@/components/ui/input";
</script>

<div class="flex flex-col w-1/2 gap-1.5">
	<p>Email Address</p>
	<Input
		type="email"
		placeholder="mail@example.com"
		disabled={passwordGenerator.isGenerating}
		bind:value={passwordGenerator.addressedEmailAddress}
	/>
</div>
