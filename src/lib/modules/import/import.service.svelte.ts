import { ZodError } from "zod";
import { mPassImportSchema } from "./types/mPass/import.mpass.zod";
import { importState } from "./import.state.svelte";
import { bitwardenImportSchema } from "./types/bitwarden/import.bitwarden.zod";
import type { Bitwarden } from "./types/bitwarden/import.bitwarden";
import type {
    NewPassword,
    Password,
} from "../passwords/passwords.types.svelte";
import { passwordsService } from "../passwords/passwords.service.svelte";

class ImportService {
    public parseData = (content: string): void => {
        this._tryParseMpass(content);
        this._tryParseBitwarden(content);
    };

    public importPasswords = async (content: string): Promise<void> => {
        const parsedContent = JSON.parse(content);

        if (importState.parsedTypes.length === 0) {
            throw new Error("No valid import format found");
        }

        if (importState.parsedTypes.length > 1) {
            throw new Error(
                "Found multiple parsed services. Will be fixed in the future",
            );
        }

        let passwords: NewPassword[] = [];

        if (importState.parsedTypes[0] === "mPass") {
            passwords = this.convertMpassToMpass(parsedContent as Password[]);
        } else if (importState.parsedTypes[0] === "Bitwarden") {
            passwords = this.convertBitwardenToMpass(
                parsedContent as Bitwarden,
            );
        }

        if (!passwords.length) {
            throw new Error("No passwords found in the file");
        }

        await passwordsService.importPasswords(passwords);
    };

    // this looks weird, but we don't need to send id and dates when importing
    public convertMpassToMpass = (content: Password[]): NewPassword[] =>
        content.map((item) => {
            return {
                title: item.title,
                username: item.username,
                password: item.password,
                note: item.note,
                websites: item.websites,
                tags: item.tags,
            } as NewPassword;
        });

    public convertBitwardenToMpass = (content: Bitwarden): NewPassword[] => {
        if (content.encrypted) {
            throw new Error("Encrypted Bitwarden import is not supported");
        }

        return content.items.map((item) => {
            return {
                title: item.name,
                username: item.login.username,
                password: item.login.password,
                note: item.notes,
                websites: item.login.uris.map((uri) => uri.uri),
                tags: [],
            } as NewPassword;
        });
    };

    private _tryParseMpass = (content: string) => {
        try {
            mPassImportSchema.parse(JSON.parse(content));

            if (!importState.parsedTypes.includes("mPass"))
                importState.parsedTypes.push("mPass");
        } catch (err: any) {
            if (err instanceof ZodError) {
                console.error(err.errors);
            } else {
                throw err;
            }
        }
    };

    private _tryParseBitwarden = (content: string) => {
        try {
            bitwardenImportSchema.parse(JSON.parse(content));

            if (!importState.parsedTypes.includes("Bitwarden"))
                importState.parsedTypes.push("Bitwarden");
        } catch (err: any) {
            if (err instanceof ZodError) {
                console.error("error in bitwarden", err.errors);
            } else {
                throw err;
            }
        }
    };
}

export const importService = new ImportService();
