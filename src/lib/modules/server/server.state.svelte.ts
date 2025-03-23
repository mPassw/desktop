class ServerState {
    public serverUrl: string = $state("");
    public serverVersion: string = $state("unknown");

    public clearState = () => {
        this.serverUrl = "";
        this.serverVersion = "unknown";
    };
}

export const serverState = new ServerState();
