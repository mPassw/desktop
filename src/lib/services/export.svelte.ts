import * as path from "@tauri-apps/api/path";

import passwords from "./passwords.svelte";

import type { Password } from "@/types";
import {
	BaseDirectory,
	create,
	exists,
	FileHandle,
	mkdir,
} from "@tauri-apps/plugin-fs";
import { revealItemInDir } from "@tauri-apps/plugin-opener";

class ExportService {
	public decryptedPasswords: Password[] = $state([]);

	public currentExportType: "csv" | "json" = $state("json");

	public export = async () => {
		this.decryptedPasswords = [];

		for (const password of passwords.passwords) {
			const tempPassword = {
				...password,
				websites: [...password.websites],
				tags: [...password.tags],
			};

			const decryptedPassword = await passwords.decryptPassword(
				tempPassword
			);
			this.decryptedPasswords.push(decryptedPassword);
		}

		const timestamp = new Date()
			.toISOString()
			.replace(/:/g, "-")
			.replace(/\..+/, "")
			.replace("T", "_");
		const fileName = `export_${timestamp}.${this.currentExportType}`;

		const file = await this._createFile(fileName);

		const content =
			this.currentExportType === "csv"
				? this._convertToCSV(this.decryptedPasswords)
				: JSON.stringify(this.decryptedPasswords, null, 2);

		await file.write(new TextEncoder().encode(content));
		await file.close();

		this.decryptedPasswords = [];

		await revealItemInDir(
			(await path.appDataDir()) + "/exports/" + fileName
		);
	};

	private _createFile = async (fileName: string): Promise<FileHandle> => {
		if (!(await exists("exports", { baseDir: BaseDirectory.AppData }))) {
			await mkdir("exports", { baseDir: BaseDirectory.AppData });
		}

		return await create("exports/" + fileName, {
			baseDir: BaseDirectory.AppData,
		});
	};

	private _convertToCSV = (passwords: Password[]): string => {
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

		const csvContent = [headers.join(",")];

		for (const pass of passwords) {
			const row = [
				this._escapeCSV(pass.id.toString()),
                this._escapeCSV(pass.inTrash.toString()),
				this._escapeCSV(pass.title),
				this._escapeCSV(pass.username),
				this._escapeCSV(pass.password),
				this._escapeCSV(pass.note),
				this._escapeCSV(pass.websites.join("|")),
				this._escapeCSV(pass.tags.join("|")),
			];
			csvContent.push(row.join(","));
		}

		return csvContent.join("\n");
	};

	private _escapeCSV = (value: string | null): string => {
		if (!value) return '""';

		const needsQuotes =
			value.includes(",") || value.includes('"') || value.includes("\n");
		const escaped = value.replace(/"/g, '""');

		return needsQuotes ? `"${escaped}"` : escaped;
	};
}

const exportService = new ExportService();
export default exportService;
