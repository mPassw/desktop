import words from "$lib/assets/words.txt";
import passwords from "./passwords.svelte";
import { invoke } from "@tauri-apps/api/core";
import { load, Store } from "@tauri-apps/plugin-store";
import { v4 as uuidv4 } from "uuid";

export interface HistoryItem {
	id: string;
	type: "password" | "username";
	value: string;
	salt: string;
	nonce: string;
	encrypted: boolean;
}

const getRandomChar = (set: string): string => {
	return set.charAt(Math.floor(Math.random() * set.length));
};

const shuffleArray = (arr: number[]): number[] => {
	return arr.sort(() => Math.random() - 0.5);
};

class PasswordGenerator {
	private _wordsList: string[] = $state([]);

	public CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	public NUMBERSET = "0123456789";
	public SPECIALSET = "!@#$%^&*()_+";

	public isGenerating: boolean = $state(false); // this is used to disable button, input, etc

	public generatedPassword = $state("");

	public type: "password" | "username" | "history" = $state("password");
	public passwordType: "password" | "passphrase" = $state("password");
	public usernameType: "addressedEmail" | "randomWord" =
		$state("addressedEmail");

	public passwordLength: number = $state(12);
	public passwordNumbersAmount: number = $state(1);
	public passwordSpecialAmount: number = $state(1);

	public passphraseLength: number = $state(4);
	public passphraseSeparator: string = $state("-");
	public passphraseCapitalize: boolean = $state(true);
	public passphraseNumbersAmount: number = $state(1);

	public addressedEmailAddress: string = $state("");
	public addressedEmailLength: number = $state(6);

	public randomWordCapitalize: boolean = $state(true);
	public randomWordNumbers: boolean = $state(true);

	constructor() {
		(async () => {
			await this._loadWordsList();
		})();
	}

	private _loadWordsList = async (): Promise<void> => {
		if (this._wordsList.length > 0) return;

		const text = await (await fetch(words)).text();
		this._wordsList = text.split("\n");
	};

	/**
	 * Get a random word(s) from the list
	 */
	private _getWords = async (
		amount: number = 1,
		capitalize: boolean = false
	): Promise<string[]> => {
		if (this._wordsList.length === 0) {
			throw new Error("Word list not loaded yet");
		}

		const result: string[] = [];

		for (let i = 0; i < amount; i++) {
			const randomIndex = Math.floor(
				Math.random() * this._wordsList.length
			);

			let word = this._wordsList[randomIndex].trim();
			if (capitalize) {
				word = word.charAt(0).toUpperCase() + word.slice(1);
			}

			result.push(word);
		}

		return result;
	};

	private _getStore = async (): Promise<Store> =>
		await load("passwords.json", { autoSave: false });

	private _getHistory = async (): Promise<HistoryItem[]> =>
		(await (await this._getStore()).get("history")) || [];

	private _saveToHistory = async () => {
		const { encrypted, salt, nonce } = await invoke<{
			encrypted: string;
			salt: string;
			nonce: string;
		}>("encrypt_string", {
			encryptionKey: passwords.encryptionKey,
			plaintext: this.generatedPassword,
		});

		const item: HistoryItem = {
			id: uuidv4(),
			type: this.type as "password" | "username",
			value: encrypted,
			salt,
			nonce,
			encrypted: true,
		};

		const store = await this._getStore();
		const history = await this._getHistory();

		await store.set("history", [item, ...history].slice(0, 100));
		await store.save();
	};

	public loadHistory = async (): Promise<HistoryItem[]> => {
		const history = await this._getHistory();

		return history;
	};

	public decryptHistoryItem = async (
		item: HistoryItem
	): Promise<HistoryItem> => {
		item.value = await invoke<string>("decrypt_string", {
			encryptionKey: passwords.encryptionKey,
			encrypted: item.value,
			salt: item.salt,
			nonce: item.nonce,
		});

		item.encrypted = false;

		return item;
	};

	public clearHistory = async () => {
		const store = await this._getStore();

		await store.set("history", []);
		await store.save();
	};

	/**
	 * Generate a password based on the current settings
	 */
	public generate = async () => {
		const oldPasswordState = this.generatedPassword;

		if (this.type === "password") {
			if (this.passwordType === "password") {
				this.generatedPassword = await this.generatePassword();
			} else if (this.passwordType === "passphrase") {
				this.generatedPassword = await this.generatePassphrase();
			}
		} else if (this.type === "username") {
			if (this.usernameType === "addressedEmail") {
				this.generatedPassword = await this.generateAddressedEmail();
			} else if (this.usernameType === "randomWord") {
				this.generatedPassword = await this.generateRandomWord();
			}
		}

		if (oldPasswordState === this.generatedPassword) {
			throw new Error("Password is the same as the previous one");
		}

		await this._saveToHistory();
	};

	public generatePassword = async (): Promise<string> => {
		if (
			this.passwordNumbersAmount + this.passwordSpecialAmount >
			this.passwordLength
		) {
			throw new Error(
				"The sum of numbers and specials exceeds the password length"
			);
		}

		const result = Array(this.passwordLength)
			.fill("")
			.map(() => getRandomChar(this.CHARSET.toLowerCase()));

		const availablePositions = Array.from(
			{ length: this.passwordLength },
			(_, i) => i
		);

		// place numeric characters
		for (let i = 0; i < this.passwordNumbersAmount; i++) {
			const posIndex = Math.floor(
				Math.random() * availablePositions.length
			);
			const pos = availablePositions.splice(posIndex, 1)[0];
			result[pos] = getRandomChar(this.NUMBERSET);
		}

		// place special characters
		for (let i = 0; i < this.passwordSpecialAmount; i++) {
			const posIndex = Math.floor(
				Math.random() * availablePositions.length
			);
			const pos = availablePositions.splice(posIndex, 1)[0];
			result[pos] = getRandomChar(this.SPECIALSET);
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

	public generatePassphrase = async (): Promise<string> => {
		const words = await this._getWords(
			this.passphraseLength,
			this.passphraseCapitalize
		);

		const availablePositions = Array.from(
			{ length: this.passphraseLength },
			(_, i) => i
		);
		shuffleArray(availablePositions);

		for (
			let i = 0;
			i < Math.min(this.passphraseNumbersAmount, this.passphraseLength);
			i++
		) {
			const pos = availablePositions[i];
			const randomNum = Math.floor(Math.random() * 10);

			words[pos] = words[pos] + randomNum;
		}

		return words.join(this.passphraseSeparator);
	};

	public generateAddressedEmail = async (): Promise<string> => {
		const [name, domain] = this.addressedEmailAddress.split("@");

		const random = Math.random()
			.toString(36)
			.substring(2, 2 + this.addressedEmailLength);

		return `${name}+${random}@${domain}`;
	};

	public generateRandomWord = async (): Promise<string> => {
		const word = await this._getWords(1, this.randomWordCapitalize);

		if (this.randomWordNumbers) {
			const numbers = Math.floor(Math.random() * 10000)
				.toString()
				.padStart(4, "0");
			return word[0] + numbers;
		}

		return word[0];
	};
}

const passwordGenerator = new PasswordGenerator();
export default passwordGenerator;
