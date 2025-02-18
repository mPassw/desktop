<script lang="ts">
	import { mode } from "mode-watcher";

	let {
		width = 1024,
		height = 1024,
		className = "",
	}: {
		width?: number;
		height?: number;
		className?: string;
	} = $props();
</script>

<svg
	{width}
	{height}
	viewBox="0 0 1024 1024"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={className}
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M373 447H651L726 522V800.5L651 875H373L298 800V522L373 447ZM519.061 650.067C530.548 646.963 539 636.469 539 624C539 609.088 526.912 597 512 597C497.088 597 485 609.088 485 624C485 636.794 493.899 647.51 505.845 650.295L474.828 726.25H550.172L519.061 650.067Z"
		fill={$mode === "light" ? "black" : "white"}
	/>
	<path
		d="M597 149H427L373 204V427H447V251L474 224H550L577 251V427H651V204L597 149Z"
		fill={$mode === "light" ? "black" : "white"}
	/>
</svg>
