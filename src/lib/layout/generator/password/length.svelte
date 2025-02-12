<script lang="ts">
	import passwordGenerator from "@/state/passwordGenerator.svelte";
	import Icon from "@iconify/svelte";

	import { Slider } from "@/components/ui/slider";
	import { Button } from "@/components/ui/button";

	const lengthMin = 4;
	const lengthMax = 64;
</script>

<div class="flex flex-col w-1/2 gap-1.5">
	<div class="flex flex-row w-full justify-between items-center">
		<p>Password Length</p>
		<div class="flex flex-row gap-1.5 items-center">
			<Button
				onclick={() => (passwordGenerator.passwordLength += 1)}
				disabled={passwordGenerator.passwordLength >= lengthMax ||
					passwordGenerator.isGenerating}
				variant="ghost"
				class="w-8 h-8"
			>
				<Icon icon="lucide:plus" font-size="20" />
			</Button>
			<p>{passwordGenerator.passwordLength}</p>
			<Button
				onclick={() => (passwordGenerator.passwordLength -= 1)}
				disabled={passwordGenerator.passwordLength <= lengthMin ||
					passwordGenerator.isGenerating}
				variant="ghost"
				class="w-8 h-8"
			>
				<Icon icon="lucide:minus" font-size="20" />
			</Button>
		</div>
	</div>
	<Slider
		type="single"
		bind:value={passwordGenerator.passwordLength}
		disabled={passwordGenerator.isGenerating}
		min={lengthMin}
		max={lengthMax}
	/>
</div>
