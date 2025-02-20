<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";

	import Loader from "@/components/animations/loaders/loader.svelte";
	import auth from "@/services/auth.svelte";
	import passwords from "@/services/passwords.svelte";
	import loadersState from "@/services/loaders.svelte";

	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { toast } from "svelte-sonner";
	import { Button, buttonVariants } from "@/components/ui/button";

	let isDialogOpen: boolean = $state(false);
	let newEmail: string = $state("");
	let masterPassword: string = $state("");

	const updateEmail = async () => {
		loadersState.isDialogLoaderVisible = true;

		const encryptionKey = passwords.encryptionKey; // save current encryption key, because it will be changed

		try {
			if (newEmail.trim().length === 0) {
				throw new Error("Email cannot be empty");
			}

			if (!(await passwords.verifyMasterPassword(masterPassword))) {
				throw new Error("Invalid master password");
			}

			await auth.updateEmail(newEmail, masterPassword);
			await auth.logOut();
		} catch (err: any) {
			passwords.encryptionKey = encryptionKey; // restore encryption key
			await passwords.getPasswords(); // restore passwords
			console.error(err);
			toast.error(err.message ?? "Unknown error");
		} finally {
			loadersState.isDialogLoaderVisible = false;
		}
	};
</script>

<div class="flex flex-col gap-1.5">
	<div class="flex flex-row w-full gap-1.5">
		<div class="flex w-1/2 flex-col gap-1.5">
			<Label for="new-email">New Email</Label>
			<Input
				bind:value={newEmail}
				id="new-email"
				type="email"
				placeholder="mail@example.com"
			/>
		</div>
		<div class="flex w-1/2 flex-col gap-1.5">
			<Label for="master-password">Master Password</Label>
			<Input
				bind:value={masterPassword}
				id="master-password"
				type="password"
				placeholder="********"
			/>
		</div>
	</div>
	<div class="self-end">
		<Dialog.Root bind:open={isDialogOpen}>
			<Dialog.Trigger
				class="self-end {buttonVariants({ variant: 'secondary' })}"
			>
				Update Email
			</Dialog.Trigger>
			<Dialog.Content
				class="overflow-y-auto min-h-fit max-h-[90%]"
				interactOutsideBehavior={loadersState.isDialogLoaderVisible
					? "ignore"
					: "close"}
				escapeKeydownBehavior={loadersState.isDialogLoaderVisible
					? "ignore"
					: "close"}
			>
				{#if loadersState.isDialogLoaderVisible}
					<Loader dark={true} />
				{/if}
				<Dialog.Header>
					<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
					<Dialog.Description class="text-md leading-5">
						This action will update your account's email address and
						re-encrypt all stored passwords. The process duration
						depends on your hardware and the number of stored
						passwords. For security reasons, you'll be automatically
						logged out after the update is complete. <br />
						It is highly recommended to export your passwords before
						updating your email.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Button
						variant="secondary"
						onclick={() => (isDialogOpen = false)}
					>
						Cancel
					</Button>
					<Button variant="default" onclick={updateEmail}>
						Update
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
		<!-- <Button variant="secondary" onclick={updateEmail}>Update Email</Button> -->
	</div>
</div>
