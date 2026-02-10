# Onboarding Platform API

> A production-grade fintech onboarding API built with Node.js, Express, and PostgreSQL

## 🎯 Project Status

**Current Phase:** Foundation - Ready to Begin Implementation

This project is being built step-by-step following a comprehensive implementation plan. See [`COMPLETE_ROADMAP.md`](COMPLETE_ROADMAP.md) for the full development plan.

## 📋 What This Project Demonstrates

- **Backend Development:** RESTful API design with Node.js and Express
- **Database Design:** PostgreSQL with normalized schema and migrations
- **Testing:** 80%+ test coverage with Jest (unit + integration tests)
- **Authentication:** JWT-based authentication with bcrypt password hashing
- **Code Quality:** Clean architecture, error handling, input validation
- **DevOps:** Git workflow, deployment, environment configuration

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│     Express API Server          │
│  ┌──────────────────────────┐  │
│  │  Routes & Controllers    │  │
│  └──────────┬───────────────┘  │
│             │                   │
│  ┌──────────▼───────────────┐  │
│  │  Business Logic Layer    │  │
│  └──────────┬───────────────┘  │
│             │                   │
│  ┌──────────▼───────────────┐  │
│  │  Data Access Layer       │  │
│  │  (Models)                │  │
│  └──────────┬───────────────┘  │
└─────────────┼───────────────────┘
              │
              ▼
      ┌───────────────┐
      │  PostgreSQL   │
      │   Database    │
      └───────────────┘
```

## 🚀 Current Features

### Implemented
- ✅ Basic Express server
- ✅ In-memory data storage
- ✅ Health check endpoint
- ✅ Application submission endpoint
- ✅ Admin view endpoint

### Planned (See Roadmap)
- 🔄 PostgreSQL database integration
- 🔄 JWT authentication
- 🔄 Comprehensive testing
- 🔄 Error handling & validation
- 🔄 API documentation
- 🔄 Deployment to Heroku/Railway

## 📚 API Endpoints

### Current Endpoints

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok"
}
```

#### Create Application
```http
POST /applications
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}
```
**Response:**
```json
{
  "applicationId": 1,
  "status": "submitted"
}
```

#### Get All Applications (Admin)
```http
GET /admin/applications
```
**Response:**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "productType": "checking",
    "status": "submitted"
  }
]
```

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (planned)
- **Authentication:** JWT (planned)
- **Testing:** Jest + Supertest (planned)
- **Validation:** Express-validator (planned)

## 📖 Development Roadmap

This project follows a structured 9-phase implementation plan:

1. **Phase 1:** Foundation Setup - Git & Project Structure
2. **Phase 2:** Database Integration - PostgreSQL Setup
3. **Phase 3:** Replace In-Memory Storage with PostgreSQL
4. **Phase 4:** Testing Infrastructure - Jest & Test Coverage
5. **Phase 5:** Authentication & Security - JWT Implementation
6. **Phase 6:** Error Handling & Validation
7. **Phase 7:** Documentation - README & API Docs
8. **Phase 8:** Deployment - Heroku/Railway
9. **Phase 9:** Optional Enhancements

**📄 Full Details:** See [`COMPLETE_ROADMAP.md`](COMPLETE_ROADMAP.md)

## 🎓 Learning Objectives

This project is designed to demonstrate:

- RESTful API design principles
- Database schema design and normalization
- Authentication and authorization patterns
- Test-driven development (TDD)
- Error handling and validation
- Git workflow and version control
- Deployment and DevOps basics

## 🔗 Related Documentation

- **Implementation Plan:** [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) - Detailed technical specifications
- **Complete Roadmap:** [`COMPLETE_ROADMAP.md`](COMPLETE_ROADMAP.md) - Step-by-step guide
- **Career Strategy:** [`../plans/`](../plans/) - How this project fits into career goals

## 📝 License

This is a portfolio/learning project.

## 👤 Author

Trent - Backend Software Engineer

**Focus Areas:** Node.js, Express, PostgreSQL, REST APIs, Testing

---

**Status:** 🚧 Under Active Development

Last Updated: February 10, 2026
