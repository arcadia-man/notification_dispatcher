import { Engine, RuleProperties } from "json-rules-engine";
import { ChannelTriggerTime } from "../constants/constant";

const templates = {
    email: "Hello {{username}}, here is your {{eventType}} info: {{payload}}",
    sms: "Hi {{username}}, {{eventType}} update: {{payload}}",
    slack: "Hey {{username}}, check your {{eventType}} details: {{payload}}",
};

const rules: RuleProperties[] = [
    {
        name: "OrderPlaced - Email",
        conditions: {
            all: [
                { fact: "eventType", operator: "equal", value: "orderPlaced" },
                { fact: "preference", operator: "equal", value: "email" },
                { fact: "email_id", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.bike_name", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.orderId", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.orderAmount", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.placed_location", operator: "truthy", value: undefined }
            ]
        },
        event: { type: "email", params: { template: templates.email, trigger: ChannelTriggerTime.BUSINESS_HOURS } }
    },
    {
        name: "OrderPlaced - SMS",
        conditions: {
            all: [
                { fact: "eventType", operator: "equal", value: "orderPlaced" },
                { fact: "preference", operator: "equal", value: "sms" },
                { fact: "phone_no", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.bike_name", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.orderId", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.orderAmount", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.placed_location", operator: "truthy", value: undefined }
            ]
        },
        event: { type: "sms", params: { template: templates.sms } }
    },
    {
        name: "OrderPlaced - Slack",
        conditions: {
            all: [
                { fact: "eventType", operator: "equal", value: "orderPlaced" },
                { fact: "preference", operator: "equal", value: "slack" },
                { fact: "slack_id", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.bike_name", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.orderId", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.orderAmount", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.placed_location", operator: "truthy", value: undefined }
            ]
        },
        event: { type: "slack", params: { template: templates.slack } }
    },
    {
        name: "Advertisement - Email",
        conditions: {
            all: [
                { fact: "eventType", operator: "equal", value: "advertisement" },
                { fact: "preference", operator: "equal", value: "email" },
                { fact: "email_id", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.adId", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.campaignName", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.targetLocation", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.targetAudience", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.budget", operator: "truthy", value: undefined }
            ]
        },
        event: { type: "email", params: { template: templates.email } }
    },
    {
        name: "Advertisement - SMS",
        conditions: {
            all: [
                { fact: "eventType", operator: "equal", value: "advertisement" },
                { fact: "preference", operator: "equal", value: "sms" },
                { fact: "phone_no", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.adId", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.campaignName", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.targetLocation", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.targetAudience", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.budget", operator: "truthy", value: undefined }
            ]
        },
        event: { type: "sms", params: { template: templates.sms } }
    },
    {
        name: "Advertisement - Slack",
        conditions: {
            all: [
                { fact: "eventType", operator: "equal", value: "advertisement" },
                { fact: "preference", operator: "equal", value: "slack" },
                { fact: "slack_id", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.adId", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.campaignName", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.targetLocation", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.targetAudience", operator: "truthy", value: undefined },
                { fact: "payload", path: "$.budget", operator: "truthy", value: undefined }
            ]
        },
        event: { type: "slack", params: { template: templates.slack } }
    }
];


const engine = new Engine(rules);
engine.addOperator("truthy", (factValue: any, value: any) => {
  if (factValue === null || factValue === undefined) return false;
  if (typeof factValue === "string" && factValue.trim() === "") return false;
  return true;
});

export { engine };