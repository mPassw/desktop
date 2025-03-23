import type { Password } from "../passwords/passwords.types.svelte";

class ImportState {
    public parsedTypes: string[] = $state([]);
}

export const importState = new ImportState();
