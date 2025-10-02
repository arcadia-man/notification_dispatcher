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
    // {
    //     userId: "amit@example.com",
    //     contact: {
    //         email_id: "amit@example.com",
    //         username: "Amit",
    //         phone_no: "+919700112233",
    //         slack_id: "U1003",
    //     },
    //     preferences: {
    //         orderPlaced: [Channel.EMAIL],
    //         passwordReset: [Channel.EMAIL],
    //         advertisement: [Channel.SMS]
    //     },
    //     order: [{
    //         bike_name: "KTM Duke",
    //         orderId: "ORD003",
    //         orderAmount: 210000,
    //         placed_location: "Delhi"
    //     }],
    //     advertisement: [{
    //         adId: "AD003",
    //         campaignName: "KTM Racing League",
    //         targetLocation: "Delhi",
    //         targetAudience: "Sports Enthusiasts",
    //         budget: 450000,
    //         userEmail: "amit@example.com"
    //     }]
    // },
    // {
    //     userId: "neha@example.com",
    //     contact: {
    //         email_id: "neha@example.com",
    //         username: "Neha",
    //         phone_no: "+919988776655",
    //         slack_id: "U1004",
    //     },
    //     preferences: {
    //         orderPlaced: [Channel.EMAIL, Channel.SMS],
    //         passwordReset: [Channel.SMS],
    //         advertisement: [Channel.EMAIL]
    //     },
    //     order: [{
    //         bike_name: "TVS Jupiter",
    //         orderId: "ORD004",
    //         orderAmount: 72000,
    //         placed_location: "Chennai"
    //     }],
    //     advertisement: [{
    //         adId: "AD004",
    //         campaignName: "Jupiter Family Ride",
    //         targetLocation: "Chennai",
    //         targetAudience: "Families",
    //         budget: 200000,
    //         userEmail: "neha@example.com"
    //     }]
    // },
    // {
    //     email_id: "suresh@example.com",
    //     username: "Suresh",
    //     phone_no: "+919955443322",
    //     slack_id: "U1005",
    //     preferences: {
    //         orderPlaced: [Channel.EMAIL],
    //         passwordReset: [Channel.EMAIL],
    //         advertisement: [Channel.SLACK]
    //     },
    //     order: [{
    //         bike_name: "Bajaj Pulsar",
    //         orderId: "ORD005",
    //         orderAmount: 95000,
    //         placed_location: "Hyderabad"
    //     }],
    //     advertisement: [{
    //         adId: "AD005",
    //         campaignName: "Pulsar Power Deal",
    //         targetLocation: "Hyderabad",
    //         targetAudience: "Office Commuters",
    //         budget: 250000,
    //         userEmail: "suresh@example.com"
    //     }]
    // },
    // {
    //     email_id: "anjali@example.com",
    //     username: "Anjali",
    //     phone_no: "+919911223344",
    //     slack_id: "U1006",
    //     preferences: {
    //         orderPlaced: [Channel.SMS, Channel.EMAIL],
    //         passwordReset: [Channel.SMS],
    //         advertisement: [Channel.EMAIL]
    //     },
    //     order: [{
    //         bike_name: "Yamaha R15",
    //         orderId: "ORD006",
    //         orderAmount: 160000,
    //         placed_location: "Pune"
    //     }],
    //     advertisement: [{
    //         adId: "AD006",
    //         campaignName: "R15 Speed Challenge",
    //         targetLocation: "Pune",
    //         targetAudience: "Young Bikers",
    //         budget: 400000,
    //         userEmail: "anjali@example.com"
    //     }]
    // },
    // {
    //     email_id: "vikas@example.com",
    //     username: "Vikas",
    //     phone_no: "+919977665544",
    //     slack_id: "U1007",
    //     preferences: {
    //         orderPlaced: [Channel.EMAIL],
    //         passwordReset: [Channel.EMAIL],
    //         advertisement: [Channel.SLACK]
    //     },
    //     order: [{
    //         bike_name: "Hero Splendor",
    //         orderId: "ORD007",
    //         orderAmount: 69000,
    //         placed_location: "Kolkata"
    //     }],
    //     advertisement: [{
    //         adId: "AD007",
    //         campaignName: "Splendor Savings",
    //         targetLocation: "Kolkata",
    //         targetAudience: "Daily Commuters",
    //         budget: 180000,
    //         userEmail: "vikas@example.com"
    //     }]
    // },
    // {
    //     email_id: "meena@example.com",
    //     username: "Meena",
    //     phone_no: "+919966554433",
    //     slack_id: "U1008",
    //     preferences: {
    //         orderPlaced: [Channel.EMAIL, Channel.SMS],
    //         passwordReset: [Channel.EMAIL],
    //         advertisement: [Channel.EMAIL]
    //     },
    //     order: [{
    //         bike_name: "Suzuki Access",
    //         orderId: "ORD008",
    //         orderAmount: 85000,
    //         placed_location: "Ahmedabad"
    //     }],
    //     advertisement: [{
    //         adId: "AD008",
    //         campaignName: "Suzuki Summer Ride",
    //         targetLocation: "Ahmedabad",
    //         targetAudience: "College Students",
    //         budget: 220000,
    //         userEmail: "meena@example.com"
    //     }]
    // },
    // {
    //     email_id: "rahul@example.com",
    //     username: "Rahul",
    //     phone_no: "+919955667788",
    //     slack_id: "U1009",
    //     preferences: {
    //         orderPlaced: [Channel.SMS],
    //         passwordReset: [Channel.SMS],
    //         advertisement: [Channel.SLACK]
    //     },
    //     order: [{
    //         bike_name: "Royal Enfield Classic",
    //         orderId: "ORD009",
    //         orderAmount: 190000,
    //         placed_location: "Jaipur"
    //     }],
    //     advertisement: [{
    //         adId: "AD009",
    //         campaignName: "Classic Cruiser Offer",
    //         targetLocation: "Jaipur",
    //         targetAudience: "Touring Riders",
    //         budget: 350000,
    //         userEmail: "rahul@example.com"
    //     }]
    // },
    // {
    //     email_id: "kavita@example.com",
    //     username: "Kavita",
    //     phone_no: "+919922334455",
    //     slack_id: "U1010",
    //     preferences: {
    //         orderPlaced: [Channel.EMAIL, Channel.SMS],
    //         passwordReset: [Channel.EMAIL],
    //         advertisement: [Channel.EMAIL, Channel.SLACK]
    //     },
    //     order: [{
    //         bike_name: "Honda Unicorn",
    //         orderId: "ORD010",
    //         orderAmount: 110000,
    //         placed_location: "Lucknow"
    //     }],
    //     advertisement: [{
    //         adId: "AD010",
    //         campaignName: "Unicorn Urban Ride",
    //         targetLocation: "Lucknow",
    //         targetAudience: "Working Professionals",
    //         budget: 270000,
    //         userEmail: "kavita@example.com"
    //     }]
    // }
];

