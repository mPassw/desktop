<script lang="ts">
    import * as Select from "$lib/components/ui/select";

    import { Label } from "$lib/components/ui/label";
    import { generatorState } from "$lib/modules/generator/generator.state.svelte";
</script>

<div class="flex gap-1.5 w-full mt-1">
    <div class="flex flex-col w-1/2 gap-1">
        <Label>Generate</Label>
        <Select.Root type="single" bind:value={generatorState.type}>
            <Select.Trigger>
                {generatorState.type === "password" ? "Password" : "Username"}
            </Select.Trigger>
            <Select.Content>
                <Select.Item value="password">Password</Select.Item>
                <Select.Item value="username">Username</Select.Item>
            </Select.Content>
        </Select.Root>
    </div>

    <div class="flex flex-col w-1/2 gap-1">
        <Label>Type</Label>
        {#if generatorState.type === "password"}
            <Select.Root type="single" bind:value={generatorState.passwordType}>
                <Select.Trigger>
                    {generatorState.passwordType === "password"
                        ? "Password"
                        : "Passphrase"}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="password">Password</Select.Item>
                    <Select.Item value="passphrase">Passphrase</Select.Item>
                </Select.Content>
            </Select.Root>
        {:else if generatorState.type === "username"}
            <Select.Root type="single" bind:value={generatorState.usernameType}>
                <Select.Trigger>
                    {generatorState.usernameType === "addressedEmail"
                        ? "Addressed Email"
                        : "Random Word"}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="addressedEmail">
                        Addressed Email
                    </Select.Item>
                    <Select.Item value="randomWord">Random Word</Select.Item>
                </Select.Content>
            </Select.Root>
        {/if}
    </div>
</div>
