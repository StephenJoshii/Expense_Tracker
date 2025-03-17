# Expense Tracker API

**Expense Tracker API** is a robust backend API built with Node.js (Express) and MySQL. It enables users to efficiently manage their personal finances by providing CRUD operations for expense tracking, balance calculation, and secure user authentication.

[Expense Tracker API Demonstration](https://www.loom.com/share/c744359da30d48a4a92c5242dc35a99d?sid=22a11221-26bb-4a82-a80d-0ffba64d20a8)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Folder Structure](#folder-structure)
- [Running the Application](#running-the-application)

---

## Features

- **User Authentication:** Secure user registration, login, and logout functionality using Firebase Authentication.
- **Expense Management (CRUD):**
    - **Create:** Add new expense transactions with descriptions and amounts.
    - **Read:** Retrieve a list of all recorded expenses.
    - **Update:** Modify the details of existing expense transactions.
    - **Delete:** Remove individual expense transactions from the history.
- **Balance Calculation:** Automatically calculates and returns the user's current account balance based on transaction history.
- **Financial Insight:** Displays a generated financial quote.

---

## Tech Stack

- **Backend:** Node.js (Express)
- **Database:** MySQL
- **Authentication:** Firebase Authentication
- **HTTP Server:** Node.js
- **Environment Variables:** dotenv
- **HTTP Client:** Axios (for testing purposes)

---

## Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (recommended version 18 or higher)
- [npm](https://www.npmjs.com/) (or yarn)
- [MySQL](https://www.mysql.com/) (make sure it's running on your machine or accessible via a cloud service)
- [Firebase Account](https://firebase.google.com/)

---

## Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/StephenJoshii/Expense_Tracker.git
    cd Expense_Tracker
    ```

2. **Install Node Dependencies:**

    ```bash
    npm install
    ```

---


This application uses MySQL as its database. The connection details are configured using environment variables.

 **Install MySQL Server:**
    * Install MySQL server on your local machine or use a cloud-based MySQL service.


## Configuration

- **Environment Variables:**
    * The application relies on environment variables for database connection details and Firebase configuration. Ensure that your `.env` file is properly configured.

---

## Running the Application

1. **Start the Node.js Server:**

    ```bash
    cd backend
    node server.js 
    ```

2. **Start the Fronttend:**
    ```bash
    npm run dev

## Folder Structure