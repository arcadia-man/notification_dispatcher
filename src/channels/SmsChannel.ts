import { NotificationChannel } from "./NotificationChannel";

export class SmsChannel implements NotificationChannel {
    async send(userId: string, message: string): Promise<boolean> {
        console.log(`📱 Sending SMS to ${userId}: '${message}'`);
        // Simulate a channel that can fail sometimes (30% chance of failure)
        const success = Math.random() > 0.3;
        return Promise.resolve(success);
    }
}