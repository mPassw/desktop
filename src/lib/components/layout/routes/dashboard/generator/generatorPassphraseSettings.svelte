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
            <Label for="separator">Separator</Label>
            <Input
                type="text"
                id="separator"
                placeholder="-"
                bind:value={generatorState.passphraseSeparator}
                minlength={0}
                maxlength={3}
            />
        </div>
        <div class="flex flex-col gap-1.5 w-1/2">
            <Label for="capitalize">Capitalize</Label>
            <Switch
                bind:checked={generatorState.passphraseCapitalize}
                id="capitalize"
                class="mt-1.5"
            />
        </div>
    </div>
    <div class="flex gap-1.5">
        <div class="flex flex-col gap-1.5 w-1/2">
            <div class="flex justify-between">
                <Label>Length</Label>
                <div class="flex gap-1.5">
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.passphraseLength--}
                    >
                        <Minus size={14} />
                    </Button>
                    <p class="cursor-default">
                        {generatorState.passphraseLength}
                    </p>
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.passphraseLength++}
                    >
                        <Plus size={14} />
                    </Button>
                </div>
            </div>
            <div class="px-2">
                <Slider
                    type="single"
                    bind:value={generatorState.passphraseLength}
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
                        onclick={() => generatorState.passphraseNumbers--}
                    >
                        <Minus size={14} />
                    </Button>
                    <p class="cursor-default">
                        {generatorState.passphraseNumbers}
                    </p>
                    <Button
                        variant="ghost"
                        size="mini"
                        onclick={() => generatorState.passphraseNumbers++}
                    >
                        <Plus size={14} />
                    </Button>
                </div>
            </div>
            <div class="px-2">
                <Slider
                    type="single"
                    bind:value={generatorState.passphraseNumbers}
                    min={0}
                    max={generatorState.passphraseLength}
                />
            </div>
        </div>
    </div>
</div>
