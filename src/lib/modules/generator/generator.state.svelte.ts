import { authState } from "../auth/auth.state.svelte";
import type { HistoryItem } from "./generator.types.svelte";

class GeneratorState {
    public wordsList: string[] = $state([]);

    public generated: string = $state("");
    public history: HistoryItem[] = $state([]);

    public type: "password" | "username" = $state("password");

    public passwordType: "password" | "passphrase" = $state("password");
    public usernameType: "addressedEmail" | "randomWord" =
        $state("addressedEmail");

    public passwordLength: number = $state(12);
    public passwordNumbers: number = $state(2);
    public passwordSpecials: number = $state(2);

    public passphraseLength: number = $state(4);
    public passphraseSeparator: string = $state("-");
    public passphraseCapitalize: boolean = $state(true);
    public passphraseNumbers: number = $state(1);

    public addressedEmailAddress: string = $state(authState.user?.email || "");
    public addressedEmailLength: number = $state(6);

    public randomWordCapitalize: boolean = $state(true);
    public randomWordNumbers: number = $state(2);

    public clearState = () => {
        this.generated = "";

        this.type = "password";

        this.passwordType = "password";
        this.usernameType = "addressedEmail";

        this.passwordLength = 12;
        this.passwordNumbers = 2;
        this.passwordSpecials = 2;

        this.passphraseLength = 4;
        this.passphraseSeparator = "-";
        this.passphraseCapitalize = true;
        this.passphraseNumbers = 1;

        this.addressedEmailAddress = authState.user?.email || "";
        this.addressedEmailLength = 6;

        this.randomWordCapitalize = true;
        this.randomWordNumbers = 2;
    };
}

export const generatorState = new GeneratorState();
