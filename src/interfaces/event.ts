import { EventType } from "../constants/constant";

export interface Event  {
    eventType: EventType;
    userId: string;
    payload: Record<string, any>;
};