# 🚀 Notification Dispatcher (TypeScript)

A **scalable, rule-driven notification system** built with **TypeScript + Node.js**.
It supports **batch processing, retries, quiet hours, and channel-specific formatting** to simulate real-world notification workflows.

This project demonstrates **system design, clean architecture, and fault-tolerant communication systems**.

---

## 📌 Features

✅ **Batch Processing** – Queue multiple events and process them at configurable intervals.
✅ **Retry with Exponential Backoff** – Ensures reliable delivery with 3 retry attempts.
✅ **Quiet Hours & Scheduling** – Avoid disturbing users during off-hours, auto-reschedule delivery.
✅ **Channel-Specific Formatting** – Custom formatting for Email, SMS, and Slack.
✅ **Rule Engine Integration** – Define dynamic rules like:

* Notify only during business hours
* Notify if order amount > $100
  ✅ **Metrics Tracking** – Logs events, success/failure counts, retries per channel.

---

## 📂 Project Structure

```
notification_dispatcher/
├── channels/             # Channel implementations (Email, SMS, Slack)
├── constants/            # Constants & enums
├── interfaces/           # Event & User interfaces
├── lib/                  # Core NotificationDispatcher
├── services/             # UserService, RuleEngineService, MetricTracker, EventHandler
├── utils/                # Time & user helpers
├── tests/                # Jest test cases
├── index.ts              # Entry point
└── README.md             # Project documentation
```

---

## ⚙️ Tech Stack

* **Language:** TypeScript
* **Runtime:** Node.js (v20.x)
* **Testing:** Jest
* **Architecture:** Event-driven, modular services

---

## ▶️ Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/arcadia-man/notification_dispatcher.git
cd notification_dispatcher
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Tests

```bash
npm run test
```

### 4. Start Application

```bash
npm run start
```

---

## 🖥️ Example Output

```bash
Queueing message for ravi@example.com via email
Queueing message for U1001 via slack
...
Sending EMAIL to ravi@example.com: 'Hello Ravi, here is your orderPlaced info: {...}'
Successfully sent notification to ravi@example.com via email.
Sending SLACK message to U1001: 'Hey Ravi, check your orderPlaced details: {...}'
Retrying in 1.0 seconds...
Successfully sent notification to U1001 via slack.

----- Notification Metrics -----
Total Events Received: 5
Notifications Sent (by Channel):
  - email: 2
  - slack: 1
  - sms: 1
Total Failures: 2
Total Retries: 3
--------------------------------
```

---

## 📊 System Design Overview

**Flow: (src/index.js starts simulation)**

1. **EventHandlerService** receives an event.
2. **RuleEngineService** validates event against rules.
3. **NotificationDispatcher** queues message with correct trigger (immediate/scheduled).
4. **Dispatcher** sends via channel (Email/SMS/Slack) with retries + backoff.
5. **MetricTracker** logs delivery stats.

---

## 🔮 Future Enhancements

* Add Kafka/RabbitMQ for distributed queueing.
* Support push notifications & WhatsApp channels.
* Store events & metrics in database for analytics.
* Provide admin dashboard for monitoring.

---


👤 **Pritam Kumar Maurya**
💼 [LinkedIn](https://www.linkedin.com/in/pritam-m-9b81b3371/)

---

🔥 This project is a **showcase of clean TypeScript code, event-driven design, and real-world notification handling**.

---
