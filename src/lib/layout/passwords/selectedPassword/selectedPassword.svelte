<script lang="ts">
	import Buttons from "./buttons.svelte";
	import Title from "./title.svelte";
	import Username from "./username.svelte";
	import Password from "./password.svelte";
	import Note from "./note.svelte";
	import Websites from "./websites.svelte";
	import Tags from "./tags.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { Separator } from "@/components/ui/separator";
	import { openUrl as open } from "@tauri-apps/plugin-opener";
	import { toast } from "svelte-sonner";

	let {
		isDecrypting = $bindable(),
		isPageTrash,
	}: {
		isDecrypting: boolean;
		isPageTrash: boolean;
	} = $props();

	let isPasswordRevealed: boolean = $state(false);
	let newWebsite: string = $state("");
	let newTag: string = $state("");
	const openUrl = async (url: string) => {
		try {
			const urlWithProtocol = url.match(/^https?:\/\//)
				? url
				: `https://${url}`;
			await open(urlWithProtocol);
		} catch (err: any) {
			console.error(err);
			toast.error(err);
		}
	};

	const copyText = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Copied to clipboard");
		} catch (err: any) {
			console.error(err);
			toast.error(err);
		}
	};

	const autoResize = (e: any) => {
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + "px";
	};
</script>

<div class="w-1/2 flex flex-col gap-1.5 overflow-auto h-full p-2">
	{#if !isDecrypting}
		<Blurfade delay={0} class="flex flex-col gap-1.5">
			<Buttons {isPageTrash} />
			<Title {copyText} />
			<Username {copyText} />
			<Password bind:isPasswordRevealed {copyText} />
			<Note {copyText} {autoResize} />
			<Separator />
			<Websites bind:newWebsite {copyText} {openUrl} />
			<Tags bind:newTag {copyText} />
		</Blurfade>
	{/if}
</div>
