import { Channel } from "../constants/constant";
import { User } from "../interfaces/user";

export const mockUsers: User[] = [
    {
        userId: "ravi@example.com",
        contact: {
            email_id: "ravi@example.com",
            username: "Ravi",
            phone_no: "+919876543210",
            slack_id: "U1001",
        },
        preferences: {
            orderPlaced: [Channel.EMAIL, Channel.SLACK],
            passwordReset: [Channel.EMAIL],
            advertisement: [Channel.EMAIL]
        },
        order: [{
            bike_name: "Royal Enfield",
            orderId: "ORD001",
            orderAmount: 175000,
            placed_location: "Bangalore"
        }],
        advertisement: [{
            adId: "AD001",
            campaignName: "Royal Enfield Launch",
            targetLocation: "Bangalore",
            targetAudience: "Young Riders",
            budget: 500000,
            userEmail: "ravi@example.com"
        }]
    },
    {
        userId: "priya@example.com",
        contact: {
            email_id: "priya@example.com",
            username: "Priya",
            phone_no: "+919812345678",
            slack_id: "U1002",
        },
        preferences: {
            orderPlaced: [Channel.SMS],
            passwordReset: [Channel.SMS],
            advertisement: [Channel.SLACK]
        },
        order: [{
            bike_name: "Honda Activa",
            orderId: "ORD002",
            orderAmount: 78000,
            placed_location: "Mumbai"
        }],
        advertisement: [{
            adId: "AD002",
            campaignName: "Activa Festive Offer",
            targetLocation: "Mumbai",
            targetAudience: "College Students",
            budget: 300000,
            userEmail: "priya@example.com"
        }]
    },
    {
        userId: "amit@example.com",
        contact: {
            email_id: "amit@example.com",
            username: "Amit",
            phone_no: "+919700112233",
            slack_id: "U1003",
        },
        preferences: {
            orderPlaced: [Channel.EMAIL],
            passwordReset: [Channel.EMAIL],
            advertisement: [Channel.SMS]
        },
        order: [{
            bike_name: "KTM Duke",
            orderId: "ORD003",
            orderAmount: 210000,
            placed_location: "Delhi"
        }],
        advertisement: [{
            adId: "AD003",
            campaignName: "KTM Racing League",
            targetLocation: "Delhi",
            targetAudience: "Sports Enthusiasts",
            budget: 450000,
            userEmail: "amit@example.com"
        }]
    },
];

