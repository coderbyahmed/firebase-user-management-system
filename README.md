https://coderbyahmed.github.io/firebase-user-management-system/

# Firebase User Management System

A modern **User Management System** built using **HTML, Tailwind CSS, Vanilla JavaScript, Firebase Authentication, and Cloud Firestore**. This project demonstrates complete user authentication and CRUD (Create, Read, Update, Delete) operations with a clean, responsive dashboard.

---

# Features

## Authentication

* User Signup using Email & Password
* User Login using Email & Password
* Forgot Password (Email Reset)
* Secure Logout
* Login State Management
* Firebase Authentication Integration
* Protected Dashboard (Unauthorized users are redirected to Login)

---

## User Management (CRUD)

Authenticated users can manage their own records.

Features include:

* Add User
* View User Details
* Edit User Information
* Delete User
* Display All User Records in a Table

Each user can access only their own data using their Firebase Authentication UID.

---

## User Information

The application stores the following information:

* Full Name
* Email
* Age
* City
* Profession

---

## Dashboard

Modern dashboard includes:

* User Information Form
* Responsive Data Table
* View Details Modal
* Edit Functionality
* Delete Confirmation
* Logout Button
* Responsive Design

---

## User Experience

* Responsive Layout
* Modern Glassmorphism Authentication UI
* Animated Background
* Loading Spinner while Saving Data
* SweetAlert2 Notifications
* Clean Form Validation
* Mobile Friendly Interface

---

# Technologies Used

### Frontend

* HTML5
* Tailwind CSS
* Custom CSS
* Vanilla JavaScript (ES6 Modules)

### Backend

* Firebase Authentication
* Cloud Firestore

### Libraries

* SweetAlert2
* Firebase JavaScript SDK

---

# Firebase Features Used

## Authentication

* createUserWithEmailAndPassword()
* signInWithEmailAndPassword()
* sendPasswordResetEmail()
* signOut()
* onAuthStateChanged()

---

## Firestore

* addDoc()
* getDocs()
* getDoc()
* updateDoc()
* deleteDoc()
* collection()
* doc()
* query()
* where()

---

# Folder Structure

```text
firebase-user-management/
│
├── index.html
├── signup.html
├── forgot-password.html
├── dashboard.html
│
├── config/
│   └── firebase.js
│
├── css/
│   └── style.css
│
├── js/
│   ├── login.js
│   ├── signup.js
│   ├── forgotPassword.js
│   ├── dashboard.js
│   └── authGuard.js
│
└── assets/
    ├── images/
    └── icons/
```

---

# Installation

## 1. Clone Repository

```bash
git clone <repository-url>
```

---

## 2. Open Project

Open the project in Visual Studio Code.

---

## 3. Configure Firebase

Create a Firebase project and enable:

* Authentication (Email & Password)
* Cloud Firestore Database

Replace your Firebase configuration inside:

```text
config/firebase.js
```

---

## 4. Run Project

Use Live Server or any local development server.

---

# Firebase Configuration

Create a file:

```text
config/firebase.js
```

Add your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

---

# Security

* Authentication handled by Firebase Authentication.
* User data stored securely in Cloud Firestore.
* Every record is linked with the authenticated user's UID.
* Users can only view and manage their own records.

---

# Project Workflow

1. User creates an account.
2. User logs in.
3. Dashboard opens automatically.
4. User adds personal records.
5. Records are stored in Firestore.
6. Dashboard displays only the logged-in user's records.
7. User can View, Edit, and Delete records.
8. User logs out securely.

---

# Screens

* Login Page
* Signup Page
* Forgot Password Page
* Dashboard
* User Form
* Users Table
* View User Modal

---

# Future Improvements

* User Profile Management
* Profile Picture Upload
* Search Users
* Filter Records
* Pagination
* Export to PDF
* Export to Excel
* Dark/Light Theme Toggle
* Email Verification
* Phone Authentication
* Role-Based Access Control (Admin/User)

---

# Learning Outcomes

This project demonstrates practical implementation of:

* Firebase Authentication
* Firestore CRUD Operations
* Authentication State Management
* JavaScript ES6 Modules
* Responsive UI Design
* Form Validation
* Loading States
* SweetAlert2 Integration
* User-Specific Data Access
* Modern Dashboard Development

---

# Author

**Muhammad Ahmed**

Frontend Developer | Learning Firebase & Full Stack Web Development

---

# License

This project is created for educational and learning purposes.
