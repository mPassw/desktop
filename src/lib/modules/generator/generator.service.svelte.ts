import words from "$lib/assets/words.txt";
import { invoke } from "@tauri-apps/api/core";
import { generatorState } from "./generator.state.svelte";
import { passwordsState } from "../passwords/passwords.state.svelte";
import {
    type EncryptStringResponse,
    type HistoryItem,
} from "./generator.types.svelte";
import { storageService } from "../storage/storage.service.svelte";
import { authState } from "../auth/auth.state.svelte";

class GeneratorService {
    public readonly CHARSET =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    public readonly NUMBERSET = "0123456789";
    public readonly SPECIALSET = "!@#$%^&*()_+";

    constructor() {
        (async () => {
            await this._loadWordsList();
        })();
    }

    // generate password or username based on current settings
    public generate = async () => {
        if (generatorState.type === "password") {
            if (generatorState.passwordType === "password") {
                generatorState.generated = await this._generatePassword();
            } else if (generatorState.passwordType === "passphrase") {
                generatorState.generated = await this._generatePassphrase();
            }
        } else if (generatorState.type === "username") {
            if (generatorState.usernameType === "addressedEmail") {
                generatorState.generated = await this._generateAddressedEmail();
            } else if (generatorState.usernameType === "randomWord") {
                generatorState.generated = await this._generateRandomWord();
            }
        }

        await this._saveToHistory();
    };

    public generatePassword = async (): Promise<string> => {
        generatorState.type = "password";
        generatorState.passwordType = "password";
        generatorState.passwordLength = 12;
        generatorState.passwordNumbers = 2;
        generatorState.passwordSpecials = 2;

        await this.generate();

        const password = generatorState.generated;

        generatorState.clearState();

        return password;
    };

    public generateUsername = async (): Promise<string> => {
        generatorState.type = "username";
        generatorState.usernameType = "addressedEmail";
        generatorState.addressedEmailLength = 6;
        generatorState.addressedEmailAddress = authState.user!.email;

        await this.generate();

        const username = generatorState.generated;

        generatorState.clearState();

        return username;
    };

    public loadHistory = async () =>
        (generatorState.history = await storageService.getGeneratorHistory());

    public clearHistory = async () => {
        await storageService.clearGeneratorHistory();
        generatorState.history = [];
    };

    public decryptHistoryItem = async (item: HistoryItem): Promise<void> => {
        const parts = item.value.split(":");
        if (parts.length !== 2) {
            return;
        }

        item.value = await invoke<string>("decrypt_string_with_key", {
            encryptionKey: passwordsState.encryptionKey,
            encrypted: parts[0],
            nonce: parts[1],
        });
    };

    private _generatePassword = async () => {
        if (
            generatorState.passwordNumbers + generatorState.passwordSpecials >
            generatorState.passwordLength
        ) {
            throw new Error(
                "The sum of numbers and specials must be less than the password length",
            );
        }

        const result = Array(generatorState.passwordLength)
            .fill("")
            .map(() => this._getRandomChar(this.CHARSET.toLowerCase()));

        const availablePositions = Array.from(
            { length: generatorState.passwordLength },
            (_, i) => i,
        );

        // place numeric characters
        for (let i = 0; i < generatorState.passwordNumbers; i++) {
            const posIndex = Math.floor(
                Math.random() * availablePositions.length,
            );
            const pos = availablePositions.splice(posIndex, 1)[0];
            result[pos] = this._getRandomChar(this.NUMBERSET);
        }

        // place special characters
        for (let i = 0; i < generatorState.passwordSpecials; i++) {
            const posIndex = Math.floor(
                Math.random() * availablePositions.length,
            );
            const pos = availablePositions.splice(posIndex, 1)[0];
            result[pos] = this._getRandomChar(this.SPECIALSET);
        }

        // uppercase roughly half of the remaining characters
        const positionsToUppercase = Math.floor(availablePositions.length / 2);
        for (let i = 0; i < positionsToUppercase; i++) {
            if (availablePositions.length === 0) break;
            const pos = availablePositions.pop()!;
            result[pos] = result[pos].toUpperCase();
        }

        return result.join("");
    };

    private _generatePassphrase = async (): Promise<string> => {
        const words = await this._getWords(
            generatorState.passphraseLength,
            generatorState.passphraseCapitalize,
        );

        const availablePositions = Array.from(
            { length: generatorState.passphraseLength },
            (_, i) => i,
        );
        this._shuffleArray(availablePositions);

        for (
            let i = 0;
            i <
            Math.min(
                generatorState.passphraseNumbers,
                generatorState.passphraseLength,
            );
            i++
        ) {
            const pos = availablePositions[i];
            const randomNum = Math.floor(Math.random() * 10);

            words[pos] = words[pos] + randomNum;
        }

        return words.join(generatorState.passphraseSeparator);
    };

    private _generateAddressedEmail = async (): Promise<string> => {
        const [name, domain] = generatorState.addressedEmailAddress.split("@");

        const random = Math.random()
            .toString(36)
            .substring(2, 2 + generatorState.addressedEmailLength);

        return `${name}+${random}@${domain}`;
    };

    private _generateRandomWord = async (): Promise<string> => {
        const word = await this._getWords(
            1,
            generatorState.randomWordCapitalize,
        );

        if (generatorState.randomWordNumbers > 0) {
            const maxValue = Math.pow(10, generatorState.randomWordNumbers) - 1;
            const numbers = Math.floor(Math.random() * maxValue)
                .toString()
                .padStart(generatorState.randomWordNumbers, "0");
            return word[0] + numbers;
        }

        return word[0];
    };

    private _saveToHistory = async () => {
        const { encrypted, nonce } = await invoke<EncryptStringResponse>(
            "encrypt_string_with_key",
            {
                encryptionKey: passwordsState.encryptionKey,
                plaintext: generatorState.generated,
            },
        );

        generatorState.history = await storageService.addItemToGeneratorHistory(
            {
                value: `${encrypted}:${nonce}`,
                date: new Date().toISOString(),
                type: generatorState.type,
            },
        );
    };

    private _getRandomChar = (set: string): string => {
        return set.charAt(Math.floor(Math.random() * set.length));
    };

    private _shuffleArray = (arr: number[]): number[] => {
        return arr.sort(() => Math.random() - 0.5);
    };

    private _loadWordsList = async (): Promise<void> => {
        if (generatorState.wordsList.length) return;

        const text = await (await fetch(words)).text();
        generatorState.wordsList = text.split("\n");
    };

    private _getWords = async (
        amount: number = 1,
        capitalize: boolean = false,
    ): Promise<string[]> => {
        if (generatorState.wordsList.length === 0) {
            throw new Error("Word list not loaded yet");
        }

        const result: string[] = [];

        for (let i = 0; i < amount; i++) {
            const randomIndex = Math.floor(
                Math.random() * generatorState.wordsList.length,
            );

            let word = generatorState.wordsList[randomIndex].trim();
            if (capitalize) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }

            result.push(word);
        }

        return result;
    };
}

export const generatorService = new GeneratorService();
