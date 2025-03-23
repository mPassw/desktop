export interface Password {
    id: string;
    title: string;
    inTrash: boolean;
    username: string | null;
    password: string | null;
    note: string | null;
    websites: string[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface NewPassword {
    title: string;
    username: string;
    password: string;
    note: string;
    websites: string[];
    tags: string[];
}

export interface EncryptedFieldResponse {
    encrypted: string;
    salt: string;
    nonce: string;
}
