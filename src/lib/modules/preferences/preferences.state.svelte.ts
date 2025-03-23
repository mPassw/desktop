class PreferencesState {
    public notificationsPermissionsGranted: "granted" | "denied" | "default" =
        $state("default");

    public enableAnimations: "enable" | "disable" = $state("enable");
    public enableIcons: "enable" | "disable" = $state("enable");
    public sessionDuration: "5m" | "10m" | "30m" | "1h" | "2h" = $state("30m");

    public animationsDuration: number = $derived(
        this.enableAnimations === "enable" ? 300 : 0,
    );
}

export const preferencesState = new PreferencesState();
