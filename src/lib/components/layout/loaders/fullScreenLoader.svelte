<script lang="ts">
    import { preferencesState } from "$lib/modules/preferences/preferences.state.svelte";
    import { mode } from "mode-watcher";
    import { blur, fade } from "svelte/transition";

    let {
        width = "auto",
        height = "auto",
        className = "",
    }: {
        width?: number | "auto";
        height?: number | "auto";
        className?: string;
    } = $props();

    let innerWidth: number = $state(0);
    let innerHeight: number = $state(0);

    let computedWidth: number = $derived(
        width === "auto" ? innerWidth / 2 : width,
    );
    let computedHeight: number = $derived(
        height === "auto" ? innerHeight / 2 : height,
    );
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div
    transition:fade={{ duration: preferencesState.animationsDuration }}
    class="fixed inset-0 z-40 bg-black/50"
></div>

<svg
    transition:blur={{ duration: preferencesState.animationsDuration }}
    width={computedWidth}
    height={computedHeight}
    viewBox="0 0 1024 1024"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="{className} origin-center transform-box-fill fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
>
    <defs>
        <style>
            .base {
                stroke-opacity: 0.5;
            }
        </style>
    </defs>
    <g class="base">
        <path
            d="M529.449 654.344C539.936 648.302 547 636.982 547 624C547 604.67 531.33 589 512 589C492.67 589 477 604.67 477 624C477 637.315 484.43 648.881 495.365 654.799L467.422 723.226L462.92 734.25H474.828H550.172H562.08L557.578 723.226L529.449 654.344Z"
            stroke="white"
            stroke-width="16"
            fill="none"
        />
        <path
            d="M376.314 455H647.686L718 525.314V797.171L647.702 867H376.314L306 796.686V525.314L376.314 455Z"
            stroke="white"
            stroke-width="16"
            fill="none"
        />
        <path
            d="M597 149H427L373 204V427H447V251L474 224H550L577 251V427H651V204L597 149Z"
            stroke="white"
            stroke-width="16"
        />
    </g>
    <g>
        <path
            d="M529.449 654.344C539.936 648.302 547 636.982 547 624C547 604.67 531.33 589 512 589C492.67 589 477 604.67 477 624C477 637.315 484.43 648.881 495.365 654.799L467.422 723.226L462.92 734.25H474.828H550.172H562.08L557.578 723.226L529.449 654.344Z"
            stroke="white"
            stroke-width="16"
            fill="none"
            pathLength="1000"
            stroke-dasharray="150 850"
        >
            <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-1000"
                dur="2s"
                repeatCount="indefinite"
            />
        </path>
        <path
            d="M376.314 455H647.686L718 525.314V797.171L647.702 867H376.314L306 796.686V525.314L376.314 455Z"
            stroke="white"
            stroke-width="16"
            fill="none"
            pathLength="1000"
            stroke-dasharray="200 800"
        >
            <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-1000"
                dur="2s"
                repeatCount="indefinite"
            />
        </path>
        <path
            d="M597 149H427L373 204V427H447V251L474 224H550L577 251V427H651V204L597 149Z"
            stroke="white"
            stroke-width="16"
            pathLength="1000"
            stroke-dasharray="150 850"
        >
            <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-1000"
                dur="2s"
                repeatCount="indefinite"
            />
        </path>
    </g>
</svg>
