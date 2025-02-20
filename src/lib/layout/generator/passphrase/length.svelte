<script lang="ts">
	import passwordGenerator from "@/services/passwordGenerator.svelte";

	import { Slider } from "@/components/ui/slider";
	import { Button } from "@/components/ui/button";
	import { Minus, Plus } from "lucide-svelte";

	const lengthMin = 4;
	const lengthMax = 64;
</script>

<div class="flex flex-col w-1/2 gap-1.5">
	<div class="flex flex-row w-full justify-between items-center">
		<p>Passphrase Length</p>
		<div class="flex flex-row gap-1.5 items-center">
			<Button
				onclick={() => (passwordGenerator.passphraseLength += 1)}
				disabled={passwordGenerator.passphraseLength >= lengthMax ||
					passwordGenerator.isGenerating}
				variant="ghost"
				class="w-8 h-8"
			>
				<Plus size={20} />
			</Button>
			<p>{passwordGenerator.passphraseLength}</p>
			<Button
				onclick={() => (passwordGenerator.passphraseLength -= 1)}
				disabled={passwordGenerator.passphraseLength <= lengthMin ||
					passwordGenerator.isGenerating}
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
		bind:value={passwordGenerator.passphraseLength}
		min={lengthMin}
		max={lengthMax}
	/>
</div>
