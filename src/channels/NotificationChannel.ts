export interface NotificationChannel {
    /**
     * Sends a notification message to a user.
     * @returns A promise that resolves to `true` on success and `false` on failure.
     */
    send(userId: string, message: string): Promise<boolean>;
}