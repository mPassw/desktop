<script lang="ts">
	import * as Select from "$lib/components/ui/select";

	import loadersState from "@/services/loaders.svelte";
	import exportService from "@/services/export.svelte";
	import passwords from "@/services/passwords.svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { toast } from "svelte-sonner";

	let masterPassword: string = $state("");

	const exportPasswords = async () => {
		try {
			loadersState.isFullscreenLoaderVisible = true;

			if (!(await passwords.verifyMasterPassword(masterPassword))) {
				throw new Error("Invalid master password");
			}
			masterPassword = "";

			await exportService.export();

			toast.success("Exported successfully");
		} catch (err: any) {
			toast.error(err.message ?? "Unknown error");
		} finally {
			loadersState.isFullscreenLoaderVisible = false;
		}
	};
</script>

<div class="flex flex-col gap-1.5">
	<div class="flex flex-col">
		<div class="text-lg tracking-tight">Export</div>
		<p class="text-muted-foreground">
			Export your passwords to a file. You can choose between JSON and
			CSV. Export may take a while depending on the number of passwords
			and your hardware.
		</p>
	</div>
	<div class="flex flex-row gap-1.5 mt-1">
		<div class="flex w-1/2 flex-col gap-1.5">
			<Label for="email">File type</Label>
			<Select.Root
				type="single"
				bind:value={exportService.currentExportType}
			>
				<Select.Trigger>
					{exportService.currentExportType === "json"
						? "JSON"
						: "CSV"}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="json">JSON</Select.Item>
					<Select.Item value="csv">CSV</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex w-1/2 flex-col gap-1.5">
			<Label for="master-password">Master password</Label>
			<Input
				bind:value={masterPassword}
				type="password"
				id="master-password"
				placeholder="********"
			/>
		</div>
	</div>
	<div>
		<Button variant="secondary" onclick={exportPasswords}>Export</Button>
	</div>
</div>
