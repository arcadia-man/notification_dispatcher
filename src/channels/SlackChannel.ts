import { NotificationChannel } from "./NotificationChannel";

export class SlackChannel implements NotificationChannel {
    async send(userId: string, message: string): Promise<boolean> {
        console.log(`Sending SLACK message to ${userId}: '${message}'`);
        // Simulate a flaky channel (70% chance of failure)
        const success = Math.random() > 0.7;
        return Promise.resolve(success);
    }
}