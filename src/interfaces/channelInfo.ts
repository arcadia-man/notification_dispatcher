import { Channel } from "../constants/constant";
import { Contact } from "./contact";

export interface ChannelInfo {
    channel: Channel;
    id: keyof Contact;
    value: string 
}