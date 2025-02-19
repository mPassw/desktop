<script lang="ts">
	import passwordGenerator from "@/services/passwordGenerator.svelte";
	import Type from "./type.svelte";
	import PasswordLength from "./length.svelte";
	import Numbers from "./numbers.svelte";
	import Special from "./special.svelte";
	import Capitalization from "../passphrase/capitalization.svelte";
	import PassphraseLength from "../passphrase/length.svelte";
	import PassphraseNumbers from "../passphrase/numbers.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
</script>

<Blurfade class="flex flex-col gap-3 w-full select-none">
	<Type />
	{#if passwordGenerator.passwordType === "password"}
		<div class="flex flex-row w-full gap-6">
			<PasswordLength />
			<Numbers />
		</div>
		<div class="flex flex-row w-full gap-6">
			<Special />
		</div>
	{:else}
		<div class="flex flex-row w-full gap-6">
			<PassphraseLength />
			<PassphraseNumbers />
		</div>
		<div class="flex flex-row w-full gap-6">
			<Capitalization />
		</div>
	{/if}
</Blurfade>
