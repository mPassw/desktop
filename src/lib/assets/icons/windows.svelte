<script lang="ts">
	let {
		width = 24,
		height = 24,
		className = "",
	}: {
		width?: number;
		height?: number;
		className?: string;
	} = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{width}
	{height}
	viewBox="0 0 24 24"
	class={className}
>
	<path
		fill="currentColor"
		d="M0 0h11.377v11.372H0Zm12.623 0H24v11.372H12.623ZM0 12.623h11.377V24H0Zm12.623 0H24V24H12.623"
	/>
</svg>
