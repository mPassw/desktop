class LoadersState {
	public isFullscreenLoaderVisible: boolean = $state(false);
	public isDialogLoaderVisible: boolean = $state(false);
	public isLoaderVisible: boolean = $state(false);
	public isTransparentLoaderVisible: boolean = $state(false);

	/**
	 * Helper to check if any loader is visible
	 */
	public isSomethingLoading: boolean = $state(false);
}

const loadersState = new LoadersState();
export default loadersState;
