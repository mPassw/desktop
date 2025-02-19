<script lang="ts">
	import passwordGenerator from "@/services/passwordGenerator.svelte";
	import Type from "./type.svelte";
	import Address from "./address.svelte";
	import Capitalization from "./capitalization.svelte";
	import Numbers from "./numbers.svelte";
	import Length from "./length.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
</script>

<Blurfade class="flex flex-col gap-3 w-full select-none">
	<Type />
	{#if passwordGenerator.usernameType === "addressedEmail"}
		<div class="flex flex-col w-full gap-3">
			<Address />
			<Length />
		</div>
	{:else}
		<div class="flex flex-col w-full gap-3">
			<Capitalization />
			<Numbers />
		</div>
	{/if}
</Blurfade>
