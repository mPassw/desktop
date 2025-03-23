<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";

    import { Button, buttonVariants } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Switch } from "$lib/components/ui/switch";
    import { adminState } from "$lib/modules/admin/admin.state.svelte";
    import { Eye, EyeOff, MailPlus, Save } from "lucide-svelte";
    import { authState } from "$lib/modules/auth/auth.state.svelte";
    import { toast } from "svelte-sonner";
    import { loadersState } from "$lib/modules/loaders/loaders.state.svelte";
    import { adminService } from "$lib/modules/admin/admin.service.svelte";

    let isPasswordsRevealed: boolean = $state(false);
    let isTestEmailDialogOpen: boolean = $state(false);

    let testEmailRecipient: string = $state(authState.user?.email ?? "");

    const sendTestEmail = async () => {
        try {
            loadersState.isDialogLoaderVisible = true;

            if (!testEmailRecipient.length) {
                throw new Error("Recipient email is required");
            }

            await adminService.sendTestEmail(testEmailRecipient);

            toast.success("Test email sent successfully");
            isTestEmailDialogOpen = false;
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            loadersState.isDialogLoaderVisible = false;
        }
    };

    const saveSettings = async () => {
        try {
            loadersState.isFullscreenLoaderVisible = true;
            await adminService.saveSmtpSettings();

            toast.success("SMTP settings updated");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            loadersState.isFullscreenLoaderVisible = false;
        }
    };
</script>

<div class="flex flex-col gap-2 w-full">
    <p class="text-lg font-semibold tracking-tight">SMTP</p>
    <div class="flex flex-row w-full gap-1.5">
        <div class="flex w-1/2 flex-col gap-1.5">
            <Label for="host">Host</Label>
            <Input
                bind:value={adminState.smtpSettings.host}
                type="url"
                id="host"
                placeholder="smtp.gmail.com"
            />
        </div>
        <div class="flex w-1/2 flex-col gap-1.5">
            <Label for="port">Port</Label>
            <Input
                bind:value={adminState.smtpSettings.port}
                type="number"
                id="port"
                placeholder="465"
                min={0}
                max={65535}
            />
        </div>
    </div>
    <div class="flex flex-row w-full gap-1.5">
        <div class="flex w-1/2 flex-col gap-1.5">
            <Label for="username">Username</Label>
            <Input
                bind:value={adminState.smtpSettings.username}
                type="email"
                id="username"
                placeholder="mail@example.com"
            />
        </div>
        <div class="flex w-1/2 flex-col gap-1.5">
            <Label for="password">Password</Label>
            <Input
                bind:value={adminState.smtpSettings.password}
                type={isPasswordsRevealed ? "text" : "password"}
                id="password"
                placeholder="********"
                icon={isPasswordsRevealed ? EyeOff : Eye}
                onClick={() => (isPasswordsRevealed = !isPasswordsRevealed)}
            />
        </div>
    </div>
    <div class="flex flex-row w-full gap-1.5">
        <div class="flex w-1/2 flex-col gap-1.5">
            <Label for="sender">
                Sender
                <span class="text-xs text-muted-foreground">
                    (defaults to username)
                </span>
            </Label>
            <Input
                bind:value={adminState.smtpSettings.sender}
                type="email"
                id="sender"
                placeholder="🔒 mPass <mail@example.com>"
            />
        </div>
        <div class="w-1/2 flex justify-between">
            <div class="flex w-1/2 flex-col gap-1.5">
                <Label for="enableSsl">SSL</Label>
                <Switch
                    bind:checked={adminState.smtpSettings.enableSsl}
                    id="enableSsl"
                    class="mt-2"
                />
            </div>
            <div class="flex items-center gap-1.5 mt-4">
                <Dialog.Root bind:open={isTestEmailDialogOpen}>
                    <Dialog.Trigger
                        class={buttonVariants({
                            variant: "secondary",
                            size: "sm",
                        })}
                    >
                        <MailPlus size={18} />
                        Test
                    </Dialog.Trigger>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Send test email</Dialog.Title>
                        </Dialog.Header>
                        <div class="flex flex-col gap-1.5 w-full">
                            <Label for="recipient">Recipient</Label>
                            <Input
                                bind:value={testEmailRecipient}
                                type="email"
                                id="recipient"
                                placeholder="mail@example.com"
                            />
                        </div>
                        <Dialog.Footer>
                            <Dialog.Close>
                                <Button variant="outline" size="sm">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button
                                variant="default"
                                size="sm"
                                onclick={sendTestEmail}
                            >
                                <MailPlus size={18} />
                                Send
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Root>
                <Button variant="default" size="sm" onclick={saveSettings}>
                    <Save size={18} />
                    Save
                </Button>
            </div>
        </div>
    </div>
</div>
