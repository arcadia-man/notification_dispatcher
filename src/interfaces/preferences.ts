import { Channel, EventType } from "../constants/constant";

export interface Preferences {
    [EventType.ORDER_PLACED]: Channel[];
    [EventType.PASSWORD_RESET]: Channel[];
    [EventType.ADVERTISEMENT]: Channel[];
}