class LoadersState {
	public isFullscreenLoaderVisible: boolean = $state(false);
	public isDialogLoaderVisible: boolean = $state(false);
	public isPasswordsLoaderVisible: boolean = $state(false);
	public isAdminPageLoaderVisible: boolean = $state(true);
	public isAdminPageTransparentLoaderVisible: boolean = $state(false);
}

const loadersState = new LoadersState();
export default loadersState;
