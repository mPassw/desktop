import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
} from "@tauri-apps/plugin-notification";
import { notificationsState } from "./notifications.state.svelte";

class NotificationsService {
    public getPermissions = async () => {
        notificationsState.permissionsGranted = await isPermissionGranted();
    };

    public requestPermissions = async () => {
        const permission = await requestPermission();
        notificationsState.permissionsGranted = permission === "granted";
    };

    public sendSessionExpiredNotification = () => {
        if (notificationsState.permissionsGranted) {
            sendNotification({
                title: "Session expired",
                body: "Your session has expired. Please log in again",
            });
        }
    };
}

export const notificationsService = new NotificationsService();
