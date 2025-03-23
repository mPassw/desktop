<script lang="ts">
    import { mode } from "mode-watcher";

    let {
        width = 1024,
        height = 1024,
    }: {
        width?: number;
        height?: number;
    } = $props();
</script>

<div class="flex flex-col items-center gap-0 relative">
    <svg
        {width}
        {height}
        viewBox="0 0 1024 1024"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M319.264 422.468H705.736L810 525.774V909.383L705.736 1012H319.264L215 908.694V525.774L319.264 422.468ZM522.317 702.175C538.286 697.9 550.035 683.444 550.035 666.27C550.035 645.73 533.23 629.08 512.5 629.08C491.77 629.08 474.965 645.73 474.965 666.27C474.965 683.893 487.337 698.653 503.944 702.49L460.824 807.11H565.566L522.317 702.175Z"
            fill={$mode === "dark" ? "white" : "black"}
        />
        <path
            d="M630.666 12H394.334L319.264 87.7576V394.92H422.138V152.496L459.673 115.306H565.327L602.862 152.496V394.92H705.736V87.7576L630.666 12Z"
            fill={$mode === "dark" ? "white" : "black"}
        />
    </svg>
</div>
