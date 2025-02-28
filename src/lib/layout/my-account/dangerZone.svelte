<script lang="ts">
	import * as Dialog from "@/components/ui/dialog";

	import Loader from "@/components/animations/loaders/loader.svelte";
	import loadersState from "@/services/loaders.svelte";
	import auth from "@/services/auth.svelte";

	import { Button, buttonVariants } from "@/components/ui/button";
	import { ListX, UserMinus, X } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import { makeRequest } from "@/utils";

	const invalidateAllSessions = async () => {
		try {
			loadersState.isDialogLoaderVisible = true;

			await makeRequest("/users/@me/sessions", "POST", {
				authorization: true,
			});

			await auth.logOut();
		} catch (err: any) {
			toast.error(err.message ?? "Unknown error");
		} finally {
			loadersState.isDialogLoaderVisible = false;
		}
	};
</script>

<div class="flex flex-col w-full gap-1.5">
	<p class="text-lg text-destructive">Danger Zone</p>
	<div class="flex flex-row w-full gap-1.5">
		<Dialog.Root>
			<Dialog.Trigger
				class={buttonVariants({
					variant: "destructive",
					size: "sm",
					class: "w-1/3",
				})}
			>
				<ListX size={20} />
				Invalidate all sessions
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
					<Dialog.Description>
						All of your sessions will be invalidated. You will be
						logged out of all devices.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Dialog.Close>
						<Button variant="secondary" size="sm">Cancel</Button>
					</Dialog.Close>
					<Button size="sm" onclick={invalidateAllSessions}>
						Invalidate
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>

		<Dialog.Root>
			<Dialog.Trigger
				class={buttonVariants({
					variant: "destructive",
					size: "sm",
					class: "w-1/3",
				})}
			>
				<X size={20} />
				Delete all passwords
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
					<Dialog.Description>
						All of your passwords will be deleted. This action
						cannot be undone.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Dialog.Close>
						<Button variant="secondary" size="sm">Cancel</Button>
					</Dialog.Close>
					<Button variant="destructive" size="sm">Delete</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>

		<Dialog.Root>
			<Dialog.Trigger
				class={buttonVariants({
					variant: "destructive",
					size: "sm",
					class: "w-1/3",
				})}
			>
				<UserMinus size={20} />
				Delete account
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
					<Dialog.Description>
						Your account will be deleted. This action cannot be
						undone.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Dialog.Close>
						<Button variant="secondary" size="sm">Cancel</Button>
					</Dialog.Close>
					<Button variant="destructive" size="sm">Delete</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>
