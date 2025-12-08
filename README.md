# SME Loan Pre-Screen Portal (HDFC Capstone)

## 📌 Project Overview
The **SME Pre-Screen Portal** is a "Right-First-Time" loan application system designed to streamline the lending process for Small and Medium Enterprises. 

It solves the problem of incomplete applications by enforcing a **Pre-Screening Logic** that checks eligibility rules (Turnover, Business Age) and ensures all mandatory documents (KYC, Income Proof) are uploaded *before* the application reaches the credit appraisal stage.

## 🚀 Key Features
* **Role-Based Access Control (RBAC):** Distinct portals for **Applicants** and **Bank Staff**.
* **Right-First-Time Logic:** Automated eligibility checks based on business turnover and loan amount.
* **Document Management System:** Upload, Preview, and Verify/Reject mandatory documents (PAN, ITR, Balance Sheets).
* **Secure Authentication:** JWT-based login with password encryption.
* **Real-Time Communication:** Integrated messaging system between Applicants and Staff.
* **Demo Data Seeder:** Pre-loaded with 250+ dummy applications for presentation.

## 🛠️ Tech Stack
### Backend
* **Framework:** Spring Boot 3.3 (Java 21)
* **Database:** PostgreSQL / H2 In-Memory
* **Security:** Spring Security + JWT
* **Build Tool:** Maven

### Frontend
* **Framework:** React 18 (Vite)
* **Styling:** Tailwind CSS v3
* **State Management:** React Context API
* **HTTP Client:** Axios

---

## ⚙️ Installation & Setup

### 1. Backend Setup (Spring Boot)
1.  Navigate to the backend folder:
    ```bash
    cd prescreen
    ```
2.  Install dependencies and build:
    ```bash
    mvn clean install
    ```
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    *The server will start on `http://localhost:8081`*

### 2. Frontend Setup (React)
1.  Navigate to the frontend folder:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The app will be available at `http://localhost:5173`*

---

##LIVE LINK: https://sme-loan-prescreen.onrender.com
Website takes time to load as it has been hosted on Render which is a free service and stops the service due to inactivitity for a long time.

## 🔑 Demo Credentials
The system automatically seeds demo data on the first run. Use these credentials to test the workflows:

| Role | User ID | Password | Features |
| :--- | :--- | :--- | :--- |
| **Applicant** | `APPLICANT-DEMO` | `password123` | Create App, Upload Docs, Chat |
| **Bank Staff** | `STAFF-1` | `password123` | View All, Verify Docs, Approve/Reject |

---

## 📸 Workflow Guide

1.  **Application Creation:** Applicant fills out the loan request form (Turnover, Amount, Business Type).
2.  **Auto-Eligibility Check:** System marks status as `PENDING` or `INELIGIBLE` based on business rules.
3.  **Document Upload:** Applicant uploads mandatory proofs (KYC, Income, Business).
4.  **Staff Verification:** Staff logs in, previews the documents, and marks them as `VERIFIED` or `REJECTED`.
5.  **Final Decision:** Once all docs are verified, the system marks the application as `READY FOR APPRAISAL`.

---

## 🛡️ Security Measures
* **BCrypt Hashing:** Passwords are never stored in plain text.
* **Stateless Session:** REST API uses Stateless Session Management.
* **CORS Configuration:** Restricted access to specific frontend domains.
* **File Validation:** Basic validation on document upload types.
