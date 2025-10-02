# **🔔 Notification Dispatcher (Rule-Based)**

---

## **Objective**

Design and implement a lightweight **Notification Dispatcher** that processes incoming events and routes them to users through different notification channels (e.g., email, SMS, Slack), based on user preferences and simple rules.

This problem is designed to assess your ability to:

* Abstract interfaces and business logic  
* Apply clean separation of concerns  
* Structure code for modularity and future extensibility  
* Handle practical concerns like retries, observability, and testing

You may use any language or framework you prefer. Focus on delivering maintainable, testable, production-grade code.

---

## **Problem Statement**

You're tasked with building a minimal service that can:

* Accept **event data** (e.g., user actions, system alerts)  
* Evaluate **notification rules** for each event and user  
* Dispatch notifications through available **channels**  
* Provide logs or metrics on what was sent and when

---

## **Core Requirements**

Your service should support:

### **1\. Event Ingestion**

* Accept incoming events, which contain:

  * An `event_type` (e.g., `"order_placed"`, `"system_alert"`)  
  * A `user_id`  
  * An optional payload with metadata (e.g., order ID, error message)

### **2\. User Notification Preferences**

* Maintain per-user notification preferences (can be hardcoded or mocked)

  * For each `event_type`, which **channels** to notify through (e.g., `email`, `sms`, `slack`)  
  * Optional: whether the user wants to be notified at all

### **3\. Dispatch Logic**

* Based on preferences and event type, notify the user via relevant channels  
* Each channel should be implemented as a pluggable interface/class  
* Simulate channel delivery (e.g., print to console or append to a file)

### **4\. Retry Handling**

* Simulate failure in one or more channels  
* Implement a **retry mechanism** with exponential backoff or a simple retry count

---

## **Optional Enhancements**

You may choose to implement any of the following, though they are **not required**:

* Support for **batch processing** of events  
* Scheduled delivery or **"quiet hours"** for certain channels  
* Channel-specific formatting (e.g., pretty messages for Slack)  
* Rule engine to allow conditions like:  
  * “Notify on system\_alerts only during business hours”  
  * “Notify only if order amount \> $100”

---

## **Non-Functional Requirements**

### **✅ Testability**

* Include unit tests for:  
  * Preference evaluation  
  * Channel dispatch logic  
  * Retry mechanisms

### **🔍 Observability**

* Log each dispatch attempt (success/failure)  
* Track metrics like:  
  * Events received  
  * Notifications sent per channel  
  * Failures and retries

### **🔌 Extensibility**

* Adding a new notification channel should not require rewriting existing logic  
* Future support for different event sources or formats should be straightforward

---

## **Deliverables**

You should submit:

* Source code (GitHub or zip)  
* A README with:  
  * How to run the service  
  * Sample event inputs and outputs  
  * Assumptions and design tradeoffs

* Basic tests (unit or integration)

---

## **Time Expectation**

This assignment should take **about one day** of focused engineering effort.

---

## **Evaluation Criteria**

| Area | What We Look For |
| ----- | ----- |
| Design | Clear abstractions, extensibility, separation of concerns |
| Code Quality | Modular, idiomatic, readable |
| Test Coverage | Logical tests for key functionality |
| Observability | Logging and metrics for real-world use |
| Pragmatism | Balanced design and realistic tradeoffs |
| Documentation | Setup, usage, and rationale are clear |

---

Feel free to reach out if you have any questions during the assignment. We’re looking forward to seeing your approach\!

# Solution

1. I need to create a typescript server
