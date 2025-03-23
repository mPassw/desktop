<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Slider } from "$lib/components/ui/slider";
    import { generatorState } from "$lib/modules/generator/generator.state.svelte";
    import { Minus, Plus } from "lucide-svelte";
</script>

<div class="flex flex-col gap-3 w-full">
    <div class="flex gap-1.5">
        <div class="flex flex-col gap-1.5 w-1/2">
            <Label for="email">Email</Label>
            <Input
                type="email"
                id="email"
                placeholder="mail@example.com"
                bind:value={generatorState.addressedEmailAddress}
            />
        </div>
        <div class="flex flex-col gap-1.5 w-1/2">
            <div class="flex justify-between">
                <Label>Length</Label>
                <div class="flex gap-1.5">
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.addressedEmailLength--}
                    >
                        <Minus size={14} />
                    </Button>
                    <p class="cursor-default">
                        {generatorState.addressedEmailLength}
                    </p>
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.addressedEmailLength++}
                    >
                        <Plus size={14} />
                    </Button>
                </div>
            </div>
            <div class="px-2">
                <Slider
                    type="single"
                    bind:value={generatorState.addressedEmailLength}
                    min={4}
                    max={8}
                    class="mt-1"
                />
            </div>
        </div>
    </div>
</div>
