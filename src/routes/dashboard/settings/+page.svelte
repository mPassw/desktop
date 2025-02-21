<script lang="ts">
	import Decorations from "@/layout/settings/decorations.svelte";
	import Theme from "@/layout/settings/theme.svelte";
	import OsInfo from "@/layout/settings/osInfo.svelte";
	import Animations from "@/layout/settings/animations.svelte";
	import SessionLength from "@/layout/settings/sessionLength.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { Separator } from "@/components/ui/separator";
</script>

<Blurfade class="w-full select-none h-full overflow-auto">
	<div class="p-3 flex flex-col gap-2 items-start">
		<h2 class="text-xl">Appearance</h2>
		<Theme />
		<Decorations />
		<Separator />
		<div class="flex flex-col w-full gap-1.5">
			<h2 class="text-xl">Other</h2>
			<Animations />
			<SessionLength />
		</div>
		<Separator />
		<h2 class="text-xl">System info</h2>
		<OsInfo />
	</div>
</Blurfade>
