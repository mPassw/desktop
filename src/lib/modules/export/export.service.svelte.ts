import type { Password } from "../passwords/passwords.types.svelte";
import { passwordsService } from "../passwords/passwords.service.svelte";
import { passwordsState } from "../passwords/passwords.state.svelte";
import { exportState } from "./export.state.svelte";
import {
    BaseDirectory,
    create,
    exists,
    mkdir,
    type FileHandle,
} from "@tauri-apps/plugin-fs";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { path } from "@tauri-apps/api";

class ExportService {
    public export = async () => {
        const decryptedPasswords: Password[] = [];

        for (let i = 0; i < passwordsState.passwords.length; i++) {
            decryptedPasswords.push(
                await passwordsService.decryptPassword(
                    passwordsState.passwords[i],
                ),
            );
        }

        if (
            exportState.exportType === "json" ||
            exportState.exportType === "csv"
        ) {
            await this._export(decryptedPasswords);
        } else {
            throw new Error("Unknown export type");
        }
    };

    private _export = async (passwords: Password[]) => {
        const fileName = this._generateFileName();

        const file = await this._createFile(fileName);

        const content =
            exportState.exportType === "json"
                ? JSON.stringify(passwords, null, 2)
                : this._convertToCsv(passwords);

        await file.write(new TextEncoder().encode(content));
        await file.close();

        await revealItemInDir(
            (await path.appDataDir()) + "/exports/" + fileName,
        );
    };

    private _generateFileName = (): string => {
        const timestamp = new Date()
            .toISOString()
            .replace(/:g/, "-")
            .replace(/\..+/, "")
            .replace("T", "_");

        return `mPass_export_${timestamp}.${exportState.exportType}`;
    };

    private _createFile = async (fileName: string): Promise<FileHandle> => {
        if (!(await exists("exports", { baseDir: BaseDirectory.AppData }))) {
            await mkdir("exports", { baseDir: BaseDirectory.AppData });
        }

        return await create("exports/" + fileName, {
            baseDir: BaseDirectory.AppData,
        });
    };

    private _convertToCsv = (passwords: Password[]): string => {
        const headers = [
            "id",
            "inTrash",
            "title",
            "username",
            "password",
            "note",
            "websites",
            "tags",
        ];

        const content = [headers.join(",")];

        for (const pass of passwords) {
            const row = [
                this._escapeCsv(pass.id),
                this._escapeCsv(pass.inTrash.toString()),
                this._escapeCsv(pass.title),
                this._escapeCsv(pass.username),
                this._escapeCsv(pass.password),
                this._escapeCsv(pass.note),
                this._escapeCsv(pass.websites.join(", ")),
                this._escapeCsv(pass.tags.join(", ")),
            ];

            content.push(row.join(","));
        }

        return content.join("\n");
    };

    private _escapeCsv = (value: string | null): string => {
        if (!value) return '""';

        const needsQuotes =
            value.includes(",") || value.includes("\n") || value.includes('"');
        const escaped = value.replace(/"/g, '""');

        return needsQuotes ? `"${escaped}"` : escaped;
    };
}

export const exportService = new ExportService();
