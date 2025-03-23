class LoadersState {
    public isFullscreenLoaderVisible: boolean = $state(false);
    public isDialogLoaderVisible: boolean = $state(false);

    public dialogLoaderStatus: string = $state("");

    public clearState = () => {
        this.isFullscreenLoaderVisible = false;
        this.isDialogLoaderVisible = false;
        this.dialogLoaderStatus = "";
    };
}

export const loadersState = new LoadersState();
