import { EmailChannel } from './channels/EmailChannel';
import { SmsChannel } from './channels/SmsChannel';
import { SlackChannel } from './channels/SlackChannel';
import { NotificationDispatcher } from './lib/NotificationDispatcher';
import { Event } from './interfaces/event';
import { MetricTracker } from './services/MetricTracker';
import { UserService } from './services/UserService';
import { mockUsers } from './utils/userDtl';
import { EventType } from './constants/constant';
import EventHandlerService from './services/EventHandlerService';
import { RuleEngineService } from './services/RuleEngineService';

/**
 * Entry point for the notification system.
 * 
 * This function:
 * - Initializes required services and channels.
 * - Generates sample events based on mock user data.
 * - Processes each event via the EventHandlerService.
 * - Tracks and displays metrics for processed events.
 */
async function main() {
    // Initialize metrics tracker to record event processing stats
    const metrics = new MetricTracker();

    // Service to fetch user preferences
    const prefsService = new UserService();

    // Register available notification channels
    const availableChannels = {
        email: new EmailChannel(),
        sms: new SmsChannel(),
        slack: new SlackChannel()
    };

    // Dispatcher to send notifications via appropriate channels
    const dispatcher = new NotificationDispatcher(availableChannels, metrics);

    // Array to hold generated sample events
    const sampleEvents: Event[] = [];
    
    const ruleEngine = new RuleEngineService()

    // Service to handle incoming events and trigger notifications
    const eventHandlerService = new EventHandlerService(prefsService, dispatcher, ruleEngine);

    // Generate sample events for all mock users
    mockUsers.forEach((dtl) => {
        sampleEvents.push({
            eventType: EventType.ORDER_PLACED,
            userId: dtl.userId,
            payload: dtl.order[0]
        });

        sampleEvents.push({
            eventType: EventType.ORDER_PLACED,
            userId: dtl.userId,
            payload: dtl.advertisement[0]
        });

        sampleEvents.push({
            eventType: EventType.ADVERTISEMENT,
            userId: dtl.userId,
            payload: dtl.advertisement[0]
        });

        sampleEvents.push({
            eventType: EventType.ADVERTISEMENT,
            userId: dtl.userId,
            payload: dtl.order[0]
        });
    });

    // Process each generated event sequentially
    for (const event of sampleEvents) {
        await eventHandlerService.handlEvent(event);
        console.log("--------------------------------------------------------------------------------------------");
    }

    // Display metrics for processed events
    metrics.display();
}

// Execute main function and log any errors
main().catch(console.error);
