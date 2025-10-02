export class MetricTracker {
    public eventsReceived = 0;
    public notificationsSent: Record<string, number> = {};
    public failures = 0;
    public retries = 0;

    incrementEventReceived = () => this.eventsReceived++;
    incrementNotificationSent = (channelName: string) => {
        this.notificationsSent[channelName] = (this.notificationsSent[channelName] || 0) + 1;
    };
    incrementFailure = () => this.failures++;
    incrementRetry = () => this.retries++;

    display() {
        let success = 0;
        console.log("\n----- Notification Metrics -----");
        console.log(`Total Events Received: ${this.eventsReceived}`);
        console.log("Notifications Sent (by Channel):");
        if (Object.keys(this.notificationsSent).length === 0) {
            console.log("  - None");
        } else {
            for (const [channel, count] of Object.entries(this.notificationsSent)) {
                success += count;
                console.log(`  - ${channel}: ${count}`);
            }
        }
        console.log(`Total Failures: ${this.failures}`);
        console.log(`Total Retries: ${this.retries}`);
        console.log(`Total Success: ${success}`);
        console.log(`Parmanent Failures: ${this.failures - this.retries}`);
        console.log("--------------------------------");
    }
}