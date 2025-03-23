<script lang="ts">
    import { systemInformationState } from "$lib/modules/systemInformation/systemInformation.state.svelte";
    import { getCurrentWindow } from "@tauri-apps/api/window";

    const appWindow = getCurrentWindow();

    const handleTitlebarClick = (e: MouseEvent) => {
        if (systemInformationState.platform !== "macos") return;

        e.preventDefault();

        if (e.buttons === 1) {
            e.detail === 2
                ? appWindow.toggleMaximize()
                : appWindow.startDragging();
        }
    };
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
    onmousedown={handleTitlebarClick}
    class="w-full h-14 fixed top-0 cursor-default select-none z-20"
>
</button>
