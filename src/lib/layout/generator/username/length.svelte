<script lang="ts">
	import passwordGenerator from "@/services/passwordGenerator.svelte";
	import Icon from "@iconify/svelte";

	import { Slider } from "@/components/ui/slider";
	import { Button } from "@/components/ui/button";

	const lengthMin = 4;
	const lengthMax = 12;
</script>

<div class="flex flex-col w-1/2 gap-1.5">
	<div class="flex flex-row w-full justify-between items-center">
		<p>Username Length</p>
		<div class="flex flex-row gap-1.5 items-center">
			<Button
				onclick={() => (passwordGenerator.addressedEmailLength += 1)}
				disabled={passwordGenerator.addressedEmailLength >= lengthMax ||
					passwordGenerator.isGenerating}
				variant="ghost"
				class="w-8 h-8"
			>
				<Icon icon="lucide:plus" font-size="20" />
			</Button>
			<p>{passwordGenerator.addressedEmailLength}</p>
			<Button
				onclick={() => (passwordGenerator.addressedEmailLength -= 1)}
				disabled={passwordGenerator.addressedEmailLength <= lengthMin ||
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
		disabled={passwordGenerator.isGenerating}
		bind:value={passwordGenerator.addressedEmailLength}
		min={lengthMin}
		max={lengthMax}
	/>
</div>
