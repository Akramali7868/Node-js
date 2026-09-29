# ⚡ Introduction to Event-Driven Architecture (EDA)

## 🧠 What is EDA?

Event-Driven Architecture (EDA) ek architecture pattern hai jahan
application ka flow **events** ke according work karta hai.

👉 Jab koi event hota hai, us event ko listen karne wala code
automatically execute ho jata hai.

Example:

👤 User clicks button
        ↓
⚡ Event occurs
        ↓
👂 Listener detects event
        ↓
⚙️ Handler executes
        ↓
✅ Action performed


# 🧩 EDA ke 3 Main Components

## 1️⃣ Event Emitter 📢

Event ko **generate/emit** karta hai.

👉 Meaning:

"Event kab/kaunsa trigger karna hai?"

Example:

```js
emitter.emit("orderPlaced");

📢 emit() → event trigger karta hai.

2️⃣ Event Listener 👂

Event ko listen karta hai.

👉 Meaning:

"Jab ye event hoga, mujhe bata dena."

Example:

emitter.on("orderPlaced", handler);

👂 on() → event ko listen karta hai.

3️⃣ Event Handler ⚙️

Event hone ke baad kya kaam karna hai, ye define karta hai.

Example:

function handler() {
    console.log("📦 Order processing...");
}

⚙️ Handler → actual action perform karta hai.

🔄 Complete EDA Flow
📢 Event Emitter
       ↓
   emit("orderPlaced")
       ↓
⚡ Event Occurs
       ↓
👂 Event Listener
       ↓
⚙️ Event Handler
       ↓
✅ Action
💻 Node.js Example
import EventEmitter from "events";

const emitter = new EventEmitter();

function orderHandler() {
    console.log("📦 Order processing...");
}

// 👂 Event Listener + Handler
emitter.on("orderPlaced", orderHandler);

// 📢 Event Emitter
emitter.emit("orderPlaced");
Flow:
emit("orderPlaced")
        ↓
⚡ orderPlaced Event
        ↓
👂 Listener
        ↓
⚙️ orderHandler()
        ↓
📦 Order processing...
🌍 EDA Pattern Kahan Use Hota Hai?
🟢 Node.js

⚡ Requests, streams, timers, system events etc.

🌐 Browser DOM Events

🖱️ Click
⌨️ Keyboard input
🖱️ Mouse events

💬 Chat Applications

📩 New message received
🔔 Notification

🖥️ Operating Systems

⌨️ Keyboard input
🖱️ Mouse input
🔌 Device events

▶️ YouTube Notifications

🔔 New video/event
↓
📢 Notification event
↓
📱 User ko notification

💳 Payment Processing

💰 Payment completed
↓
⚡ paymentSuccess
↓
📧 Send receipt
📦 Update order
🔔 Send notification

🎯 Real-World Example: Payment
💳 User makes payment
        ↓
📢 Payment System emits event
        ↓
⚡ "paymentSuccess"
        ↓
👂 Different services listen
        ↓
   ┌────────────┬──────────────┐
   ↓            ↓              ↓
📧 Email     📦 Order       🔔 Notification
             Update
🧠 Remember

📢 Event Emitter
→ Event ko trigger karta hai

👂 Event Listener
→ Event ko listen karta hai

⚙️ Event Handler
→ Event hone ke baad kya karna hai, wo perform karta hai

⭐ One-Line Summary

🔥 EDA = Event hua → Listener ne suna → Handler ne action perform kiya.