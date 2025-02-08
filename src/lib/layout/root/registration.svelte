<script lang="ts">
	import auth from "@/state/auth.svelte";
	import preferences from "@/state/preferences.svelte";

	import { Blurfade } from "@/components/animations/blurfade";
	import { Button } from "@/components/ui/button";
	import { Label } from "@/components/ui/label";
	import { Input } from "@/components/ui/input";
	import { createUser } from "@/auth/createUser.svelte";
	import { toast } from "svelte-sonner";
	import { slide } from "svelte/transition";

	let isLoading: boolean = $state(false);
	let isPasswordInputFocused: boolean = $state(false);
	let isRepeatPasswordInputFocused: boolean = $state(false);

	let regEmail: string = $state("");
	let regUsername: string = $state("");
	let regPassword: string = $state("");
	let regPasswordConfirm: string = $state("");

	const passwordRules = {
		minLength: {
			rule: (p: string) => p.length >= 8,
			message: "At least 8 characters",
		},
		hasNumber: {
			rule: (p: string) => /[0-9]/.test(p),
			message: "At least 1 number",
		},
		hasSpecial: {
			rule: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
			message: "At least 1 special character",
		},
		matchesPassword: {
			rule: (p: string, rp: string) => p !== "" && rp !== "" && p === rp,
			message: "Passwords must match",
		},
	};

	let passwordValidation = $state({
		minLength: false,
		hasNumber: false,
		hasSpecial: false,
		matchesPassword: false,
	});

	const isPasswordValid = () =>
		Object.values(passwordValidation).every((v) => v);

	const register = async () => {
		try {
			isLoading = true;

			if (!regEmail) {
				throw new Error("Email is required");
			}

			if (regPassword !== regPasswordConfirm) {
				throw new Error("Passwords do not match");
			}

			if (!isPasswordValid()) {
				throw new Error("Password does not meet requirements");
			}

			await createUser(regEmail, regUsername, regPassword);

			auth.email = regEmail;
			await preferences.setUserEmail(regEmail);

			regEmail = "";
			regUsername = "";
			regPassword = "";
			regPasswordConfirm = "";

			auth.loginState = "login";

			toast.success("Account created successfully");
		} catch (err: any) {
			toast.error(err.message ?? "Unknown error");
		} finally {
			isLoading = false;
		}
	};

	$effect(() => {
		passwordValidation.minLength =
			passwordRules.minLength.rule(regPassword);
		passwordValidation.hasNumber =
			passwordRules.hasNumber.rule(regPassword);
		passwordValidation.hasSpecial =
			passwordRules.hasSpecial.rule(regPassword);
		passwordValidation.matchesPassword = passwordRules.matchesPassword.rule(
			regPassword,
			regPasswordConfirm
		);
	});
</script>

<svelte:document
	onkeydown={async (e) => {
		if (e.key === "Enter" && auth.loginState === "registration") {
			await register();
		}
	}}
/>

<Blurfade delay={0} class="flex flex-col items-center w-full gap-1.5">
	<h3 class="text-2xl font-semibold">Register</h3>
	<div class="flex flex-col items-center gap-2">
		<div class="flex w-[300px] flex-col gap-1.5">
			<Label for="email">Email<span class="text-red-600">*</span></Label>
			<Input
				bind:value={regEmail}
				disabled={isLoading}
				type="email"
				id="email"
				placeholder="mail@example.com"
			/>
		</div>
		<div class="flex w-[300px] flex-col gap-1.5">
			<Label for="username">Username</Label>
			<Input
				bind:value={regUsername}
				disabled={isLoading}
				type="text"
				id="username"
				placeholder="coolname69420"
			/>
		</div>
		<div class="flex w-[300px] flex-col gap-1.5">
			<Label for="password">
				Password
				<span class="text-red-600">*</span>
			</Label>
			<Input
				bind:value={regPassword}
				onfocusin={() => (isPasswordInputFocused = true)}
				onfocusout={() => (isPasswordInputFocused = false)}
				disabled={isLoading}
				type="password"
				id="password"
				placeholder="********"
			/>
		</div>
		{#if isPasswordInputFocused}
			<div
				class="flex flex-col w-full"
				transition:slide={{ duration: 150 }}
			>
				<ul class="space-y-1">
					<li
						class={passwordValidation.minLength
							? "text-green-600"
							: "text-red-600"}
					>
						• {passwordRules.minLength.message}
					</li>
					<li
						class={passwordValidation.hasNumber
							? "text-green-600"
							: "text-red-600"}
					>
						• {passwordRules.hasNumber.message}
					</li>
					<li
						class={passwordValidation.hasSpecial
							? "text-green-600"
							: "text-red-600"}
					>
						• {passwordRules.hasSpecial.message}
					</li>
				</ul>
			</div>
		{/if}
		<div class="flex w-[300px] flex-col gap-1.5">
			<Label for="password-repeat">
				Repeat Password
				<span class="text-red-600">*</span>
			</Label>
			<Input
				bind:value={regPasswordConfirm}
				onfocusin={() => (isRepeatPasswordInputFocused = true)}
				onfocusout={() => (isRepeatPasswordInputFocused = false)}
				disabled={isLoading}
				type="password"
				id="password-repeat"
				placeholder="********"
			/>
		</div>
		{#if isRepeatPasswordInputFocused}
			<div
				class="flex flex-col w-full"
				transition:slide={{ duration: 150 }}
			>
				<ul class="space-y-1">
					<li
						class={passwordValidation.matchesPassword
							? "text-green-600"
							: "text-red-600"}
					>
						• {passwordRules.matchesPassword.message}
					</li>
				</ul>
			</div>
		{/if}
	</div>
	<Button
		disabled={isLoading}
		class="w-[300px] mt-1.5 font-semibold"
		onclick={register}
	>
		Register
	</Button>
	<div class="flex flex-row justify-between w-full max-w-[300px]">
		<Button
			onclick={() => (auth.loginState = "server-validation")}
			disabled={isLoading}
			variant="link"
			class="text-muted-foreground"
		>
			Change server URL
		</Button>

		<Button
			onclick={() => (auth.loginState = "login")}
			disabled={isLoading}
			variant="link"
			class="text-muted-foreground"
		>
			Login
		</Button>
	</div>
</Blurfade>
