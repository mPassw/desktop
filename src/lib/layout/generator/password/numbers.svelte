<script lang="ts">
	import passwordGenerator from "@/services/passwordGenerator.svelte";

	import { Button } from "@/components/ui/button";
	import { Slider } from "@/components/ui/slider";
	import { Minus, Plus } from "lucide-svelte";

	const numbersMin = 0;
	let numbersMax = $derived(
		passwordGenerator.passwordLength -
			(passwordGenerator.passwordSpecialAmount + 2)
	);
</script>

<div class="flex flex-col w-1/2 gap-1.5">
	<div class="flex flex-row w-full justify-between items-center">
		<p>Numbers</p>
		<div class="flex flex-row gap-1.5 items-center">
			<Button
				onclick={() => (passwordGenerator.passwordNumbersAmount += 1)}
				disabled={passwordGenerator.passwordNumbersAmount >=
					numbersMax || passwordGenerator.isGenerating}
				variant="ghost"
				class="w-8 h-8"
			>
				<Plus size={20} />
			</Button>
			<p>{passwordGenerator.passwordNumbersAmount}</p>
			<Button
				onclick={() => (passwordGenerator.passwordNumbersAmount -= 1)}
				disabled={passwordGenerator.passwordNumbersAmount <=
					numbersMin || passwordGenerator.isGenerating}
				variant="ghost"
				class="w-8 h-8"
			>
				<Minus size={20} />
			</Button>
		</div>
	</div>
	<Slider
		type="single"
		disabled={passwordGenerator.isGenerating}
		bind:value={passwordGenerator.passwordNumbersAmount}
		min={numbersMin}
		max={numbersMax}
	/>
</div>
