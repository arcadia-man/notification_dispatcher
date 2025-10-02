import { Channel, ChannelToIdMapping, ChannelTriggerTime, EventType } from "../constants/constant";
import { NotificationDispatcher } from "../lib/NotificationDispatcher";
import { Event } from "../interfaces/event";
import { User } from "../interfaces/user";
import { UserService } from "./UserService";
import { RuleEngineService } from "./RuleEngineService";

export default class EventHandlerService {
    constructor(private userService: UserService, private dispatcher: NotificationDispatcher, private ruleEngineService: RuleEngineService) { }

    private generateMessage(template: string, user: User, event: Event) {
        return template
            .replace('{{username}}', user.contact.username ?? 'User')
            .replace('{{eventType}}', event.eventType)
            .replace('{{payload}}', JSON.stringify(event.payload));
    }

    async dispatchMessage(rulesRes: any[], user: User, event: Event, preference: Channel) {
        for (let index = 0; index < rulesRes.length; index++) {
            const res = rulesRes[index];
            const message = this.generateMessage(res.params.template, user, event)
            const userId = user.contact[ChannelToIdMapping[preference]]
            this.dispatcher.dispatch(preference, userId, message, res.params?.trigger ? res.params.trigger : ChannelTriggerTime.IMMEDIATE)
        }
    }

    async handlEvent(event: Event) {
        const { userId, eventType, payload } = event;
        const user = this.userService.getUser(userId)
        if (!user) {
            return console.log("Invalid User")
        }
        const preferences = user.preferences[eventType]
        if (!preferences || preferences.length === 0) {
            return console.log("User didn't opted for communication")
        }
        const engindat = {}
        for (let index = 0; index < preferences.length; index++) {
            const preference = preferences[index];
            const engindata = { ...user.contact, eventType, payload, preference }
            const rulesRes = await this.ruleEngineService.validateByRuleEngine(engindata);
            this.dispatchMessage(rulesRes, user, event, preference)
        }
    }
}