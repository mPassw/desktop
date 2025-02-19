<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";

	import Loader from "@/components/animations/loaders/loader.svelte";
	import admin from "@/state/admin.svelte";
	import loadersState from "@/state/loaders.svelte";
	import auth from "@/state/auth.svelte";

	import { Button, buttonVariants } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { Switch } from "@/components/ui/switch";
	import { Eye, EyeOff, Mail, MailPlus, Save } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { cn } from "@/utils";

	let isPasswordRevealed: boolean = $state(false);
	let testEmailRecipient: string = $state(auth.email);

	const updateSmtpSettings = async () => {
		try {
			loadersState.isAdminPageTransparentLoaderVisible = true;

			await admin.updateSmtpSettings();
		} catch (err: any) {
			toast.error(err.message ?? "Unknown error");
		} finally {
			loadersState.isAdminPageTransparentLoaderVisible = false;
		}
	};

	const sendTestEmail = async () => {
		try {
			if (!testEmailRecipient || !testEmailRecipient.trim().length) {
				throw new Error("Recipient email is required");
			}

			loadersState.isDialogLoaderVisible = true;

			await admin.sendTestEmail(testEmailRecipient);

			toast.success("Email sent successfully");
		} catch (err: any) {
			toast.error(err.message ?? "Unknown error");
		} finally {
			loadersState.isDialogLoaderVisible = false;
		}
	};
</script>

<div class="flex flex-row items-center gap-1">
	<Mail />
	<p class="text-lg tracking-tight">SMTP</p>
</div>
<div class="flex flex-row w-full gap-1.5">
	<div class="flex w-1/2 flex-col gap-1">
		<Label for="smtp-host">Host</Label>
		<Input
			bind:value={admin.smtpHost}
			type="url"
			id="smtp-host"
			placeholder="smtp.gmail.com"
		/>
	</div>
	<div class="flex w-1/2 flex-col gap-1">
		<Label for="smtp-port">Port</Label>
		<Input
			bind:value={admin.smtpPort}
			type="number"
			id="smtp-port"
			placeholder="587"
			min={0}
			max={65535}
		/>
	</div>
</div>
<div class="flex flex-row w-full gap-1.5">
	<div class="flex w-1/2 flex-col gap-1">
		<Label for="smtp-username">Username</Label>
		<Input
			bind:value={admin.smtpUsername}
			type="text"
			id="smtp-username"
			placeholder="mail@example.com"
		/>
	</div>
	<div class="flex w-1/2 flex-col gap-1">
		<Label for="smtp-password">Password</Label>
		<div
			class={cn(
				"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
			)}
		>
			<input
				bind:value={admin.smtpPassword}
				type={isPasswordRevealed ? "text" : "password"}
				class="w-full bg-transparent border-none outline-none p-0"
				placeholder="********"
			/>
			<button onclick={() => (isPasswordRevealed = !isPasswordRevealed)}>
				{#if isPasswordRevealed}
					<EyeOff />
				{:else}
					<Eye />
				{/if}
			</button>
		</div>
	</div>
</div>
<div class="flex flex-row w-full gap-1.5">
	<div class="flex w-1/2 flex-col gap-1">
		<Label for="smtp-sender">
			Sender
			<span class="text-muted-foreground text-sm"
				>(defaults to username if empty)</span
			>
		</Label>
		<Input
			bind:value={admin.smtpSender}
			type="text"
			id="smtp-sender"
			placeholder={`"mPass🔒" <mail@example.com>`}
		/>
	</div>
	<div class="flex w-1/2 flex-row justify-between">
		<div class="flex flex-col gap-1">
			<p class="text-sm font-medium">SSL</p>
			<div class="h-10 flex items-center">
				<Switch bind:checked={admin.smtpSsl} />
			</div>
		</div>
		<div class="flex flex-row gap-1 items-end">
			<Button variant="secondary" onclick={updateSmtpSettings}>
				<Save size={20} />
				Save
			</Button>
			<Dialog.Root>
				<Dialog.Trigger
					class={buttonVariants({ variant: "secondary" })}
				>
					<MailPlus size={20} />
					Test message
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
					<Dialog.Header>
						<Dialog.Title>Send test email</Dialog.Title>
					</Dialog.Header>
					{#if loadersState.isDialogLoaderVisible}
						<Loader dark={true} />
					{/if}
					<div class="flex flex-col gap-1 select-none">
						<Label for="smtp-Recipient">Recipient email</Label>
						<Input
							bind:value={testEmailRecipient}
							type="email"
							id="smtp-Recipient"
							placeholder="mail@example.com"
						/>
					</div>
					<Dialog.Footer>
						<Button onclick={sendTestEmail}>
							<MailPlus size={20} />
							Send
						</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
</div>
