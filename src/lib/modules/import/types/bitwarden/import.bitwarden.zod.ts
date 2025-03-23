import type { Bitwarden, BitwardenItem } from "./import.bitwarden";
import { z } from "zod";

export const bitwardenImportSchema = z.object({
    encrypted: z.boolean(),
    folders: z.array(z.any()),
    items: z.array(
        z.object({
            passwordHistory: z.array(z.any()).nullable(),
            revisionDate: z.string(),
            creationDate: z.string(),
            deletedDate: z.string().nullable(),
            id: z.string(),
            organizationId: z.string().nullable(),
            folderId: z.string().nullable(),
            type: z.any(),
            reprompt: z.any(),
            name: z.string(),
            notes: z.string().nullable(),
            favourite: z.boolean().optional().nullable(),
            fields: z.array(z.any()).optional().nullable(),
            login: z.object({
                fido2Credentials: z.array(z.any()),
                uris: z.array(
                    z.object({
                        match: z.any().nullable(),
                        uri: z.string().nullable(),
                    }),
                ),
                username: z.string().nullable(),
                password: z.string().nullable(),
                totp: z.string().nullable(),
            }),
            collectionIds: z.array(z.any()).nullable(),
        }),
    ) as z.ZodType<BitwardenItem[]>,
}) as z.ZodType<Bitwarden>;
