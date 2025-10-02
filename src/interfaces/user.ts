import { Advertisement } from "./advertisement";
import { Contact } from "./contact";
import { Order } from "./orders";
import { Preferences } from "./preferences";

export interface User {
    userId: string;  // primary
    contact: Contact;
    preferences: Preferences;
    order: Order[];
    advertisement: Advertisement[];
}