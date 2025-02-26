<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";

	import Loader from "@/components/animations/loaders/loader.svelte";
	import auth from "@/services/auth.svelte";
	import loadersState from "@/services/loaders.svelte";

	import { Button } from "@/components/ui/button";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";
	import { makeRequest } from "@/utils";
	import { toast } from "svelte-sonner";

	let code: string = $state("");

	const getCode = async () => {
		try {
			loadersState.isDialogLoaderVisible = true;
			await makeRequest("/users/@me/verification", "GET", {
				authorization: true,
			});

			toast.success("Code sent to your email");
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			loadersState.isDialogLoaderVisible = false;
		}
	};

	const verify = async () => {
		try {
			if (code.trim().length !== 6) {
				throw new Error("Code must be 6 digits");
			}

			loadersState.isDialogLoaderVisible = true;
			await makeRequest("/users/@me/verification", "POST", {
				authorization: true,
				body: JSON.stringify({ code }),
			});

			toast.success("Email verified");

			auth.isVerified = true;
			auth.isEmailVerificationDialogOpen = false;
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			loadersState.isDialogLoaderVisible = false;
		}
	};
</script>

<Dialog.Root bind:open={auth.isEmailVerificationDialogOpen}>
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
		<Dialog.Header>Email Verification</Dialog.Header>
		<div class="flex w-full flex-col gap-1.5">
			<Label for="code">Code</Label>
			<Input
				bind:value={code}
				type="text"
				id="code"
				placeholder="123456"
			/>
		</div>
		<Dialog.Footer>
			<Button variant="secondary" onclick={getCode}>Get Code</Button>
			<Button onclick={verify}>Verify</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
