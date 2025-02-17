class LoadersState {
	public isFullscreenLoaderVisible: boolean = $state(false);
	public isPasswordsLoaderVisible: boolean = $state(false);
}

const loadersState = new LoadersState();
export default loadersState;
