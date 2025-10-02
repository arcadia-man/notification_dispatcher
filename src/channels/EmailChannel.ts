import { NotificationChannel } from "./NotificationChannel";

export class EmailChannel implements NotificationChannel {
  async send(userId: string, message: string): Promise<boolean> {
    console.log(`Sending EMAIL to ${userId}: '${message}'`);
    return Promise.resolve(true);
  }
}