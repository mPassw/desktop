<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Slider } from "$lib/components/ui/slider";
    import { Switch } from "$lib/components/ui/switch";
    import { generatorState } from "$lib/modules/generator/generator.state.svelte";
    import { Minus, Plus } from "lucide-svelte";
</script>

<div class="flex flex-col gap-3 w-full">
    <div class="flex gap-1.5">
        <div class="flex flex-col gap-1.5 w-1/2">
            <div class="flex justify-between">
                <Label>Numbers</Label>
                <div class="flex gap-1.5">
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.randomWordNumbers--}
                    >
                        <Minus size={14} />
                    </Button>
                    <p class="cursor-default">
                        {generatorState.randomWordNumbers}
                    </p>
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.randomWordNumbers++}
                    >
                        <Plus size={14} />
                    </Button>
                </div>
            </div>
            <div class="px-2">
                <Slider
                    type="single"
                    bind:value={generatorState.randomWordNumbers}
                    min={0}
                    max={8}
                />
            </div>
        </div>
        <div class="flex flex-col gap-1.5 w-1/2">
            <Label for="capitalize">Capitalize</Label>
            <Switch
                bind:checked={generatorState.randomWordCapitalize}
                id="capitalize"
                class="mt-0.5"
            />
        </div>
    </div>
</div>
