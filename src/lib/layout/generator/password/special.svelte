<script lang="ts">
	import passwordGenerator from "@/services/passwordGenerator.svelte";

	import { Button } from "@/components/ui/button";
	import { Slider } from "@/components/ui/slider";
	import { Minus, Plus } from "lucide-svelte";

	const specialMin = 1;
	let specialMax = $derived(
		passwordGenerator.passwordLength -
			(passwordGenerator.passwordNumbersAmount + 2)
	);
</script>

<div class="flex flex-col w-1/2 gap-1.5 pr-3">
	<div class="flex flex-row w-full justify-between items-center">
		<p>Special Characters</p>
		<div class="flex flex-row gap-1.5 items-center">
			<Button
				onclick={() => (passwordGenerator.passwordSpecialAmount += 1)}
				disabled={passwordGenerator.passwordSpecialAmount >=
					specialMax || passwordGenerator.isGenerating}
				variant="ghost"
				class="w-8 h-8"
			>
				<Plus size={20} />
			</Button>
			<p>{passwordGenerator.passwordSpecialAmount}</p>
			<Button
				onclick={() => (passwordGenerator.passwordSpecialAmount -= 1)}
				disabled={passwordGenerator.passwordSpecialAmount <=
					specialMin || passwordGenerator.isGenerating}
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
		bind:value={passwordGenerator.passwordSpecialAmount}
		min={specialMin}
		max={specialMax}
	/>
</div>
