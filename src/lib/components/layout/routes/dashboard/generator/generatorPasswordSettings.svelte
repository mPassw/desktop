<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import { Slider } from "$lib/components/ui/slider";
    import { generatorState } from "$lib/modules/generator/generator.state.svelte";
    import { Minus, Plus } from "lucide-svelte";
</script>

<div class="flex flex-col gap-3 w-full">
    <div class="flex gap-1.5">
        <div class="flex flex-col gap-1.5 w-1/2">
            <div class="flex justify-between">
                <Label>Length</Label>
                <div class="flex gap-1.5">
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.passwordLength--}
                    >
                        <Minus size={14} />
                    </Button>
                    <p class="cursor-default">
                        {generatorState.passwordLength}
                    </p>
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.passwordLength++}
                    >
                        <Plus size={14} />
                    </Button>
                </div>
            </div>
            <div class="px-2">
                <Slider
                    type="single"
                    bind:value={generatorState.passwordLength}
                    min={4}
                    max={64}
                />
            </div>
        </div>
        <div class="flex flex-col gap-1.5 w-1/2">
            <div class="flex justify-between">
                <Label>Numbers</Label>
                <div class="flex gap-1.5">
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.passwordNumbers--}
                    >
                        <Minus size={14} />
                    </Button>
                    <p class="cursor-default">
                        {generatorState.passwordNumbers}
                    </p>
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.passwordNumbers++}
                    >
                        <Plus size={14} />
                    </Button>
                </div>
            </div>
            <div class="px-2">
                <Slider
                    type="single"
                    bind:value={generatorState.passwordNumbers}
                    min={0}
                    max={generatorState.passwordLength -
                        generatorState.passwordSpecials}
                />
            </div>
        </div>
    </div>
    <div class="flex gap-1.5">
        <div class="flex flex-col gap-1.5 w-1/2">
            <div class="flex justify-between">
                <Label>Special characters</Label>
                <div class="flex gap-1.5">
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.passwordSpecials--}
                    >
                        <Minus size={14} />
                    </Button>
                    <p class="cursor-default">
                        {generatorState.passwordSpecials}
                    </p>
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.passwordSpecials++}
                    >
                        <Plus size={14} />
                    </Button>
                </div>
            </div>
            <div class="px-2">
                <Slider
                    type="single"
                    bind:value={generatorState.passwordSpecials}
                    min={0}
                    max={generatorState.passwordLength -
                        generatorState.passwordNumbers}
                />
            </div>
        </div>
    </div>
</div>
