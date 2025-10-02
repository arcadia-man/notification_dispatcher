import { NotificationChannel } from "../channels/NotificationChannel";
import { ChannelTriggerTime } from "../constants/constant";
import { MetricTracker } from "../services/MetricTracker";
import { shouldSendNow } from "../utils/timeUtils";

export class NotificationDispatcher {
    private messageQueue: Array<{ channel: string; userId: string; message: string; trigger: ChannelTriggerTime }> = [];
    private batchIntervalMs: number;

    constructor(
        private channels: Record<string, NotificationChannel>,
        private metrics: MetricTracker,
        private maxRetries: number = 3,
        private initialBackoffMs: number = 1000,
        batchIntervalMs: number = 5000
    ) {
        this.batchIntervalMs = batchIntervalMs;
        this.startBatchProcessor();
    }

    private sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async sendWithRetry(channelName: string, userId: string, message: string) {
        const channel = this.channels[channelName];
        if (!channel) {
            console.warn(`Channel '${channelName}' not configured.`);
            return;
        }

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            const success = await channel.send(userId, message);
            if (success) {
                console.log(`Successfully sent notification to ${userId} via ${channelName}.`);
                this.metrics.incrementNotificationSent(channelName);
                return;
            }

            this.metrics.incrementFailure();
            console.warn(`Failed to send notification to ${userId} via ${channelName}. Attempt ${attempt}/${this.maxRetries}.`);

            if (attempt < this.maxRetries) {
                this.metrics.incrementRetry();
                const backoffTime = this.initialBackoffMs * 2 ** (attempt - 1);
                console.log(`Retrying in ${(backoffTime / 1000).toFixed(1)} seconds...`);
                await this.sleep(backoffTime);
            }
        }

        console.error(`Permanently failed to send notification to ${userId} via ${channelName} after ${this.maxRetries} attempts.`);
    }

    private async processBatch() {
        if (this.messageQueue.length === 0) return;

        const now = new Date();

        const readyMessages = this.messageQueue.filter(item =>
            shouldSendNow(item.trigger, now)
        );

        const remainingMessages = this.messageQueue.filter(item =>
            !shouldSendNow(item.trigger, now)
        );

        this.messageQueue = remainingMessages;

        for (const msg of readyMessages) {
            console.log(`Sending batch message to ${msg.userId} via ${msg.channel}`);
            await this.sendWithRetry(msg.channel, msg.userId, msg.message);
        }
    }

    private startBatchProcessor() {
        setInterval(() => {
            console.log("Processing batch queue...");
            this.processBatch();
            this.metrics.display();
        }, this.batchIntervalMs);
    }

    async dispatch(channel: string, userId: string, message: string, trigger: ChannelTriggerTime = ChannelTriggerTime.IMMEDIATE) {
        this.metrics.incrementEventReceived();
        console.log(`Queueing message for ${userId} via ${channel}`);
        this.messageQueue.push({ channel, userId, message, trigger });
    }
}

// Without dispatch logic

// import { NotificationChannel } from "../channels/NotificationChannel";
// import { ChannelTriggerTime } from "../constants/constant";
// import { MetricTracker } from "../services/MetricTracker";

// export class NotificationDispatcher {
//     constructor(
//         private channels: Record<string, NotificationChannel>,
//         private metrics: MetricTracker,
//         private maxRetries: number = 3,
//         private initialBackoffMs: number = 1000
//     ) { }

//     private sleep(ms: number) {
//         return new Promise((resolve) => setTimeout(resolve, ms));
//     }

//     private async sendWithRetry(channelName: string, userId: string, message: string) {
//         const channel = this.channels[channelName];
//         if (!channel) {
//             console.warn(`Channel '${channelName}' not configured.`);
//             return;
//         }

//         for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
//             const success = await channel.send(userId, message);
//             if (success) {
//                 console.log(`Successfully sent notification to ${userId} via ${channelName}.`);
//                 this.metrics.incrementNotificationSent(channelName);
//                 return;
//             }

//             this.metrics.incrementFailure();
//             console.warn(`Failed to send notification to ${userId} via ${channelName}. Attempt ${attempt}/${this.maxRetries}.`);

//             if (attempt < this.maxRetries) {
//                 this.metrics.incrementRetry();
//                 const backoffTime = this.initialBackoffMs * 2 ** (attempt - 1);
//                 console.log(`Retrying in ${(backoffTime / 1000).toFixed(1)} seconds...`);
//                 await this.sleep(backoffTime);
//             }
//         }

//         console.error(`Permanently failed to send notification to ${userId} via ${channelName} after ${this.maxRetries} attempts.`);
//     }

//     async dispatch(channel: string, userId: string, message: string, trigger: ChannelTriggerTime = ChannelTriggerTime.IMMEDIATE) {
//         this.metrics.incrementEventReceived();
//         console.log(`Dispatching message to ${userId} via ${channel}`);
//         await this.sendWithRetry(channel, userId, message);
//     }
// }
