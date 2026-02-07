# 🧺 LaundryPay

**LaundryPay** is a **digital wallet system for laundromats** that allows users to deposit money, pay for washing machine usage, transfer funds between cards, and view usage analytics. Designed for both users and laundromat owners, LaundryPay ensures **safe transactions, real-time balance tracking, and actionable insights**.

---

## ✨ Features

### 👤 User & Account
- User registration with a **unique phone number**  
- One wallet account per user  
- Real-time **balance tracking**  
- Configurable **low-balance alerts**  

### 💰 Wallet Operations
- DepositService money into account  
- Top-up balance for laundry usage  
- Pay for laundry usage  
- Send money to another card  
- Receive money from other users  
- **Safe and atomic transfers** (all transactions are ACID-compliant)  

### 📊 Analytics
Users can view:
- **Monthly deposited amounts**  
- **Number of laundry uses**  
- **Busy vs slow hours** (peak usage analytics)  
- **Usage trends over time**  

### 🔔 Notifications
- Low balance reminders for users  
- Notification history maintained for auditing and reporting  

---

## 🧠 Design Principles
- **Transaction ledger is the source of truth** — balances are derived from deposits, usage, and transfers  
- **All money movement is immutable and auditable**  
- Built to **scale** and support **analytics**  
- Supports **soft deletes** for accounts and users  
- Designed with **MVCC and transactions** for concurrency safety  

---

## 🗄️ Database Schema Overview

### Users

users
-----
id
full_name
phone_number UNIQUE
created_at
updated_at
deleted_at

## accounts
--------
id
user_id REFERENCES users(id)
balance CHECK (balance >= 0)
created_at
updated_at
deleted_at
low_balance_threshold

##transactions
------------
id
account_id REFERENCES accounts(id)
type                  -- deposit | usage | transfer_in | transfer_out
amount                -- always positive
related_account_id    -- for transfers
machine_id            -- optional, for usage analytics
created_at


machines
--------
id
name
location
created_at
updated_at
deleted_at
