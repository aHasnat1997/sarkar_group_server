# Sarkar Group - SMD

## Goal
The **Sarkar Group - SMD** project aims to develop a monolithic REST system to manage Construction Equipment Products, Project Control Services, and Employee Management. This system utilizes modern web development tools and follows industry best practices to ensure scalability, maintainability, and security.

---

## Technology Stack
- **TypeScript**: Programming Language
- **ExpressJS**: Back-End Framework
- **Prisma ORM**: Database Operations
- **JWT**: JSON Web Tokens for Authentication and Authorization
- **Axios**: Handles external requests
- **Bcrypt**: Encrypts and decrypts secrets
- **Nodemailer**: Sends emails
- **Zod**: Validates API requests
- **EJS**: Email template engine

---

## Backend Architecture

### System Architecture Diagram
[System Architecture Diagram](https://app.eraser.io/workspace/X9rg1mcnhpg5BDfsR7TE?origin=share)

### Key Components
- **API Server**: Built with Express.js
- **Database**: Connected via Prisma ORM to MongoDB
- **Authentication**: JWT for secure user authentication and authorization
- **Validation**: Zod is used for schema validation to ensure data integrity

---

## API Overview
- **Type**: RESTful API
- **Authentication**: JWT-based for protected routes

### Main Functions
- User Authentication and Role Management
- CRUD Operations on [specific entities]
- Data validation with Zod

---

## API Endpoints

### Base URL: `http://server-domain-name.com/smd/api/v1`

### Example Endpoints
- `POST /auth/login`: User login
- `POST /auth/signup`: User registration
- `GET /users`: Get list of users (Admin)
- `POST /equipment`: Create new equipment entry

---

