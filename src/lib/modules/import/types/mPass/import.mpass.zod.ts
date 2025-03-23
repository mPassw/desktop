import { z } from "zod";
import type { Password } from "$lib/modules/passwords/passwords.types.svelte";

export const mPassImportSchema = z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        inTrash: z.boolean(),
        username: z.string().nullable(),
        password: z.string().nullable(),
        note: z.string().nullable(),
        websites: z.array(z.string()),
        tags: z.array(z.string()),
        createdAt: z.string(),
        updatedAt: z.string(),
    }),
) as z.ZodType<Password[]>;
