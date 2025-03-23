import type { NewPassword, Password } from "./passwords.types.svelte";

class PasswordsState {
    public salt: string = $state("");
    public encryptionKey: Uint8Array = $state(new Uint8Array());
    public passwords: Password[] = $state([]);
    public selectedPassword: Password | null = $state(null);

    public isInEditMode: boolean = $state(false);

    public isSearchOpen: boolean = $state(false);
    public searchValue: string = $state("");

    public isNewPasswordDialogOpen: boolean = $state(false);
    public newPassword: NewPassword = $state({
        inTrash: false,
        title: "",
        username: "",
        password: "",
        note: "",
        websites: [],
        tags: [],
    });

    public clearState = () => {
        this.salt = "";
        this.encryptionKey = new Uint8Array();
        this.passwords = [];
        this.selectedPassword = null;
        this.isInEditMode = false;

        this.isSearchOpen = false;
        this.searchValue = "";

        this.isNewPasswordDialogOpen = false;
        this.newPassword = {
            title: "",
            username: "",
            password: "",
            note: "",
            websites: [],
            tags: [],
        };
    };
}

export const passwordsState = new PasswordsState();
