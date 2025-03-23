export interface Bitwarden {
    encrypted: boolean;
    folders: any[];
    items: BitwardenItem[];
}

export interface BitwardenItem {
    passwordHistory: any[] | null;
    revisionDate: string;
    creationDate: string;
    deletedDate: string | null;
    id: string;
    organizationId: string | null;
    folderId: string | null;
    type: any;
    reprompt: any;
    name: string;
    notes: string | null;
    favourite: boolean | null | undefined;
    fields: any[] | null;
    login: BitwardenLogin;
    collectionIds: any[] | null;
}

export interface BitwardenLogin {
    fido2Credentials: any[];
    uris: BitwardenUri[];
    username: string | null;
    password: string | null;
    totp: string | null;
}

export interface BitwardenUri {
    match: any | null;
    uri: string | null;
}
