<script lang="ts">
    import type {
        HTMLInputAttributes,
        HTMLInputTypeAttribute,
    } from "svelte/elements";
    import type { WithElementRef } from "bits-ui";
    import { cn } from "$lib/utils.js";
    import type { Snippet } from "svelte";

    type InputType = Exclude<HTMLInputTypeAttribute, "file">;

    type Props = WithElementRef<
        Omit<HTMLInputAttributes, "type"> &
            (
                | { type: "file"; files?: FileList }
                | { type?: InputType; files?: undefined }
            ) & {
                icon?: any;
                onClick?: () => void;
                chidren?: Snippet<[]>;
            }
    >;

    let {
        ref = $bindable(null),
        value = $bindable(),
        type,
        files = $bindable(),
        class: className,
        icon,
        onClick,
        children,
        ...restProps
    }: Props = $props();
</script>

{#if type === "file"}
    <input
        bind:this={ref}
        class={cn(
            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
        )}
        type="file"
        bind:files
        bind:value
        {...restProps}
    />
{:else}
    <div
        class={cn(
            "group flex gap-1.5 flex-col items-start border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 h-fit min-h-10 w-full rounded-md border px-3 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative",
        )}
    >
        <input
            class="w-full bg-transparent border-none outline-none p-0 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none placeholder:text-muted-foreground"
            bind:this={ref}
            {type}
            bind:value
            {...restProps}
        />
        {#if children}
            <div class="flex items-center gap-1.5">
                {@render children()}
            </div>
        {/if}
    </div>
{/if}
