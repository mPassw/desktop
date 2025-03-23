export interface SmtpSettings {
    host: string | null;
    port: number | null;
    username: string | null;
    password: string | null;
    sender: string | null;
    enableSsl: boolean;
}
