<script lang="ts">
    import { Check } from "lucide-svelte";
    import { mode, setMode } from "mode-watcher";
</script>

<div class="flex flex-col">
    <p class="text-lg tracking-tight font-semibold">Theme</p>
    <div class="flex gap-1.5 w-full">
        <button
            onclick={() => setMode("dark")}
            class="flex flex-col gap-1.5 w-1/2 border border-input rounded-md h-36 bg-[#161718] p-2 relative"
        >
            <p class="text-lg font-medium tracking-tight text-white">Dark</p>
            <div class="rounded-xl w-2/3 h-4 bg-[#26272a]"></div>
            <div class="rounded-xl w-1/3 h-4 bg-[#26272a]"></div>
            <div class="rounded-xl w-2/4 h-4 bg-[#26272a]"></div>
            <div class="rounded-xl w-4/5 h-4 bg-[#26272a]"></div>
            {#if $mode === "dark"}
                <div class="absolute top-3 right-3">
                    <Check size={18} />
                </div>
            {/if}
        </button>
        <button
            onclick={() => setMode("light")}
            class="flex flex-col gap-1.5 w-1/2 border border-input rounded-md h-36 bg-[#fbfbfb] p-2 relative"
        >
            <p class="text-lg font-semibold tracking-tight text-black">Light</p>
            <div class="rounded-xl w-2/3 h-4 bg-[#f3efec]"></div>
            <div class="rounded-xl w-1/3 h-4 bg-[#f3efec]"></div>
            <div class="rounded-xl w-2/4 h-4 bg-[#f3efec]"></div>
            <div class="rounded-xl w-4/5 h-4 bg-[#f3efec]"></div>
            {#if $mode === "light"}
                <div class="absolute top-3 right-3">
                    <Check size={18} />
                </div>
            {/if}
        </button>
    </div>
</div>
