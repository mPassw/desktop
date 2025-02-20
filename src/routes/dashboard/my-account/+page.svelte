<script lang="ts">
	import PersonalInfo from "@/layout/my-account/personalInfo.svelte";
	import UpdateData from "@/layout/my-account/updateData.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { Separator } from "@/components/ui/separator";
</script>

<Blurfade
	class="p-3 flex flex-col w-full h-full gap-1.5 relative overflow-auto"
>
	<PersonalInfo />
	<Separator />
	<UpdateData />
</Blurfade>
