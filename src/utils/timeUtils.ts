import { ChannelTriggerTime } from "../constants/constant";

/**
 * Checks whether a message should be sent now based on the trigger time.
 * @param trigger - ChannelTriggerTime
 * @param now - Current Date object
 * @returns boolean
 */
export function shouldSendNow(trigger: ChannelTriggerTime, now: Date = new Date()): boolean {
    switch (trigger) {
        case ChannelTriggerTime.BUSINESS_HOURS:
            return now.getHours() >= 9 && now.getHours() < 21; // 9 AM — 9 PM
        case ChannelTriggerTime.QUIET_HOURS:
            return now.getHours() >= 0 && now.getHours() < 6; // Midnight — 6 AM
        case ChannelTriggerTime.IMMEDIATE:
            return true;
        default:
            return true;
    }
}