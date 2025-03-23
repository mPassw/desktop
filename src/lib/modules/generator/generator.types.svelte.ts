export interface HistoryItem {
    value: string;
    date: string;
    type: string;
}

export interface EncryptStringResponse {
    encrypted: string;
    nonce: string;
}
