<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";

	import Loader from "@/components/animations/loaders/loader.svelte";
	import loadersState from "@/services/loaders.svelte";
	import passwords from "@/services/passwords.svelte";
	import auth from "@/services/auth.svelte";

	import { Button, buttonVariants } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { toast } from "svelte-sonner";
	import { makeRequest } from "@/utils";

	let newEmail: string = $state("");
	let newUsername: string = $state("");
	let newPassword: string = $state("");
	let newPasswordConfirm: string = $state("");
	let currentPassword: string = $state("");
	let verificationCode: string = $state("");

	const getCode = async () => {
		try {
			loadersState.isDialogLoaderVisible = true;

			await makeRequest("/smtp/@me?Type=AccountUpdate", "GET", {
				authorization: true,
			});

			toast.success("Code sent to your email");
		} catch (err: any) {
			toast.error(err.message ?? "Unknown error");
		} finally {
			loadersState.isDialogLoaderVisible = false;
		}
	};

	const updateData = async () => {
		const encryptionKey = passwords.encryptionKey; // save current encryption key, because it will be changed

		try {
			loadersState.isDialogLoaderVisible = true;

			if (
				newEmail.trim().length === 0 &&
				newUsername.trim().length === 0 &&
				newPassword.trim().length === 0
			) {
				throw new Error("At least one field must be filled");
			}

			if (currentPassword.trim().length === 0) {
				throw new Error("Current password cannot be empty");
			}

			if (verificationCode.trim().length === 0) {
				throw new Error("Code cannot be empty");
			}

			if (
				!(await passwords.verifyMasterPassword(currentPassword.trim()))
			) {
				throw new Error("Invalid master password");
			}

			if (newPassword.trim().length) {
				if (currentPassword === newPassword) {
					throw new Error(
						"New password cannot be the same as current password"
					);
				}

				if (newPassword !== newPasswordConfirm) {
					throw new Error("Passwords do not match");
				}
			}

			await auth.updateData(
				currentPassword,
				verificationCode,
				newEmail,
				newUsername,
				newPassword
			);

			await auth.logOut();
		} catch (err: any) {
			passwords.encryptionKey = encryptionKey; // restore encryption key
			await passwords.getPasswords(); // restore passwords

			toast.error(err.message ?? "Unknown error");
		} finally {
			loadersState.isDialogLoaderVisible = false;
		}
	};
</script>

<p class="text-lg">Update Data</p>
<div class="flex flex-col gap-1.5 w-full">
	<div class="flex flex-row gap-1.5 w-full">
		<div class="flex flex-col gap-1.5 w-1/2">
			<Label for="new-email">New Email</Label>
			<Input
				bind:value={newEmail}
				type="email"
				id="new-email"
				placeholder="mail@example.com"
			/>
		</div>
		<div class="flex flex-col gap-1.5 w-1/2">
			<Label for="new-username">New Username</Label>
			<Input
				bind:value={newUsername}
				type="text"
				id="new-username"
				placeholder="coolname69240"
			/>
		</div>
	</div>
	<div class="flex flex-row gap-1.5 w-full">
		<div class="flex flex-col gap-1.5 w-1/2">
			<Label for="new-password">New Password</Label>
			<Input
				bind:value={newPassword}
				type="password"
				id="new-password"
				placeholder="********"
			/>
		</div>
		<div class="flex flex-col gap-1.5 w-1/2">
			<Label for="new-password-confirm">Confirm New Password</Label>
			<Input
				bind:value={newPasswordConfirm}
				type="password"
				id="new-password-confirm"
				placeholder="********"
			/>
		</div>
	</div>
	<div class="flex flex-row justify-between gap-1.5 items-center my-1">
		<p class="text-sm text-muted-foreground line-clamp-2">
			Important: Please export your passwords before updating account
			details to prevent any potential data loss.
		</p>
		<Dialog.Root>
			<Dialog.Trigger
				class="self-end {buttonVariants({
					variant: 'default',
					size: 'sm',
				})}"
			>
				Update
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
						This action will update your account details and
						re-encrypt all your stored passwords. You will be logged
						out immediately after, and all active sessions will be
						invalidated. Please ensure you've exported any important
						data before proceeding.
					</Dialog.Description>
				</Dialog.Header>
				<div class="flex flex-row gap-1.5 w-full">
					<div class="flex flex-col gap-1.5 w-1/2">
						<Label for="current-password">Master Password</Label>
						<Input
							bind:value={currentPassword}
							type="password"
							id="current-password"
							placeholder="********"
						/>
					</div>
					<div class="flex flex-col gap-1.5 w-1/2">
						<Label for="verification-code">Verification Code</Label>
						<Input
							bind:value={verificationCode}
							type="text"
							id="verification-code"
							placeholder="123456"
						/>
					</div>
				</div>
				<Dialog.Footer>
					<Button variant="secondary" onclick={getCode}>
						Get Code
					</Button>
					<Button variant="default" onclick={updateData}>
						Update
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>
