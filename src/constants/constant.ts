import { Contact } from "../interfaces/contact";

export enum Channel {
    EMAIL = "email",
    SLACK = "slack",
    SMS = "sms"
}

export enum EventType {
  ORDER_PLACED = "orderPlaced",
  PASSWORD_RESET = "passwordReset",
  ADVERTISEMENT = "advertisement"
}

export enum ChannelTriggerTime {
    BUSINESS_HOURS = "BUSINESS_HOURS", // 9 AM — 9 PM
    QUIET_HOURS = "QUIET_HOURS",       // Midnight — 6 AM
    IMMEDIATE = "IMMEDIATE"            // Send right away
}

export const ChannelToIdMapping: Record<Channel, keyof Contact> = {
  [Channel.EMAIL]: "email_id",
  [Channel.SLACK]: "slack_id",
  [Channel.SMS]: "phone_no",
};