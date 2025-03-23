export interface OfflineModeData {
    email: string;
    salt: string;
    encryptionKey: Uint8Array;
    createdAt: string;
}
