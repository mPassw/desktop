<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Tooltip from "$lib/components/ui/tooltip";

	import Loader from "@/components/animations/loaders/loader.svelte";
	import newPassword from "@/services/newPassword.svelte";
	import passwordGenerator from "@/services/passwordGenerator.svelte";
	import auth from "@/services/auth.svelte";
	import passwords from "@/services/passwords.svelte";
	import loadersState from "@/services/loaders.svelte";

	import { Button, buttonVariants } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Textarea } from "@/components/ui/textarea";
	import { Plus, RefreshCcw, Eye, EyeOff, Trash, Save } from "lucide-svelte";
	import { toast } from "svelte-sonner";

	let dialogTop: HTMLDivElement;

	let isDialogOpen: boolean = $state(false);
	let isLoading: boolean = $state(false);
	let isPasswordRevealed: boolean = $state(false);

	const generateUsername = async () => {
		try {
			isLoading = true;

			passwordGenerator.type = "username";
			passwordGenerator.usernameType = "addressedEmail";
			passwordGenerator.addressedEmailAddress = auth.email;

			await passwordGenerator.generate();

			newPassword.username = passwordGenerator.generatedPassword;
		} catch (err: any) {
			console.error(err);
			toast.error(err.message ?? "Failed to generate username");
		} finally {
			isLoading = false;
		}
	};

	const generatePassword = async () => {
		try {
			isLoading = true;

			passwordGenerator.type = "password";
			passwordGenerator.passwordType = "password";

			await passwordGenerator.generate();

			newPassword.password = passwordGenerator.generatedPassword;
		} catch (err: any) {
			toast.error(err.message ?? "Failed to generate password");
		} finally {
			isLoading = false;
		}
	};

	const addWebsite = () => {
		newPassword.websites = [
			...newPassword.websites,
			newPassword.newWebsite,
		];
		newPassword.newWebsite = "";
	};

	const addTag = () => {
		newPassword.tags = [...newPassword.tags, newPassword.newTag];
		newPassword.newTag = "";
	};

	const addPassword = async () => {
		try {
			dialogTop.scrollIntoView();

			loadersState.isDialogLoaderVisible = true;
			loadersState.isTransparentLoaderVisible = true;

			if (!newPassword.title.length) {
				if (newPassword.websites.length > 0) {
					newPassword.title = newPassword.websites[0];
				} else {
					throw new Error("Title is required");
				}
			}

			if (
				!newPassword.username.length &&
				!newPassword.password.length &&
				!newPassword.note.length
			) {
				throw new Error("At least one field is required");
			}

			await passwords.addNewPassword(
				await newPassword.getPasswordObject()
			);

			isDialogOpen = false;
			newPassword.reset();
		} catch (err: any) {
			toast.error(err.message ?? "Failed to add password");
		} finally {
			loadersState.isDialogLoaderVisible = false;
			loadersState.isTransparentLoaderVisible = false;
		}
	};
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger
		class={buttonVariants({ variant: "outline", size: "icon" })}
		disabled={auth.isOfflineMode}
	>
		<Plus />
	</Dialog.Trigger>
	<Dialog.Content
		class="min-h-72 max-h-[90%] {loadersState.isDialogLoaderVisible
			? 'overflow-hidden'
			: 'overflow-auto'}"
		interactOutsideBehavior={loadersState.isDialogLoaderVisible
			? "ignore"
			: "close"}
		escapeKeydownBehavior={loadersState.isDialogLoaderVisible
			? "ignore"
			: "close"}
	>
		<div bind:this={dialogTop} class="absolute"></div>
		{#if loadersState.isDialogLoaderVisible}
			<Loader dark={true} />
		{/if}
		<div class="flex flex-col">
			<p>Title</p>
			<Input
				bind:value={newPassword.title}
				disabled={isLoading}
				placeholder="My secret password"
				type="text"
			/>
		</div>
		<div class="flex flex-col">
			<p>Username</p>
			<div class="flex flex-row gap-1">
				<Input
					bind:value={newPassword.username}
					disabled={isLoading}
					placeholder="coolname69420"
					type="text"
				/>
				<div>
					<Tooltip.Root>
						<Tooltip.Trigger
							disabled={isLoading}
							class={buttonVariants({
								variant: "outline",
								size: "icon",
							})}
							onclick={generateUsername}
						>
							<RefreshCcw />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Generate</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</div>
		</div>
		<div class="flex flex-col">
			<p>Password</p>
			<div class="flex flex-row gap-1">
				<Input
					bind:value={newPassword.password}
					disabled={isLoading}
					placeholder="********"
					type={isPasswordRevealed ? "text" : "password"}
				/>
				<div class="flex flex-row gap-1">
					<Tooltip.Root>
						<Tooltip.Trigger
							disabled={isLoading}
							class={buttonVariants({
								variant: "outline",
								size: "icon",
							})}
							onclick={generatePassword}
						>
							<RefreshCcw />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Generate</p>
						</Tooltip.Content>
					</Tooltip.Root>
					<Tooltip.Root>
						<Tooltip.Trigger
							disabled={isLoading}
							class={buttonVariants({
								variant: "outline",
								size: "icon",
							})}
							onclick={() => {
								isPasswordRevealed = !isPasswordRevealed;
							}}
						>
							{#if isPasswordRevealed}
								<EyeOff />
							{:else}
								<Eye />
							{/if}
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Reveal</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</div>
		</div>
		<div class="flex flex-col">
			<p>Note</p>
			<Textarea
				bind:value={newPassword.note}
				disabled={isLoading}
				placeholder="Empty..."
			/>
		</div>
		<div class="flex flex-col">
			<p>Websites</p>
			<div class="flex flex-col gap-1">
				{#each newPassword.websites as _, index}
					<div class="flex flex-row gap-1">
						<Input
							bind:value={newPassword.websites[index]}
							disabled={isLoading}
							placeholder="Tag"
							type="text"
						/>
						<div>
							<Button
								variant="outline"
								size="icon"
								onclick={() => {
									newPassword.websites =
										newPassword.websites.filter(
											(_, i) => i !== index
										);
								}}
							>
								<Trash />
							</Button>
						</div>
					</div>
				{/each}
				<div class="flex flex-row gap-1">
					<Input
						bind:value={newPassword.newWebsite}
						disabled={isLoading}
						placeholder="https://example.com"
						type="url"
					/>
					<div>
						<Button
							onclick={addWebsite}
							variant="outline"
							size="icon"
							disabled={isLoading ||
								!newPassword.newWebsite.length}
						>
							<Plus />
						</Button>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-col">
			<p>Tags</p>
			<div class="flex flex-col gap-1">
				{#each newPassword.tags as _, index}
					<div class="flex flex-row gap-1">
						<Input
							bind:value={newPassword.tags[index]}
							disabled={isLoading}
							placeholder="Tag"
							type="text"
						/>
						<div>
							<Button
								variant="outline"
								size="icon"
								onclick={() => {
									newPassword.tags = newPassword.tags.filter(
										(_, i) => i !== index
									);
								}}
							>
								<Trash />
							</Button>
						</div>
					</div>
				{/each}
				<div class="flex flex-row gap-1">
					<Input
						bind:value={newPassword.newTag}
						disabled={isLoading}
						placeholder="Tag"
						type="text"
					/>
					<div>
						<Button
							onclick={addTag}
							variant="outline"
							size="icon"
							disabled={isLoading || !newPassword.newTag.length}
						>
							<Plus />
						</Button>
					</div>
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button onclick={addPassword} disabled={isLoading}>
				<Save size={22} />
				Save
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
