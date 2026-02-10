# Onboarding Platform - Complete Implementation Plan

## Project Overview

**Goal:** Transform the current basic Express API into a production-grade fintech onboarding platform that demonstrates professional backend development skills.

**Current State:**
- Basic Express server with 3 endpoints
- In-memory data storage
- No testing, authentication, or deployment

**Target State:**
- PostgreSQL database integration
- JWT authentication
- 85%+ test coverage with Jest
- Comprehensive error handling
- Deployed and accessible
- Professional documentation

**Strategic Value:** This project unlocks job opportunities at Codevista (Junior Node.js Developer), SpruceID (Full-Stack Engineer), and Halvik (Junior Full-Stack Developer).

---

## Phase 1: Foundation Setup - Git & Project Structure

### Objectives
- Initialize version control
- Establish professional Git workflow
- Organize project structure

### Tasks

#### 1.1 Initialize Git Repository
```bash
cd c:/Users/trent/OneDrive/Desktop/Portfolio/onboarding-platform
git init
```

#### 1.2 Create .gitignore
Create `.gitignore` file with:
```
node_modules/
.env
.env.local
*.log
.DS_Store
coverage/
dist/
build/
```

#### 1.3 Create Initial Commit
```bash
git add .
git commit -m "Initial commit: Basic Express API with in-memory storage"
```

#### 1.4 Create GitHub Repository
- Create new repository on GitHub: `onboarding-platform`
- Push local repository:
```bash
git remote add origin https://github.com/[your-username]/onboarding-platform.git
git branch -M main
git push -u origin main
```

#### 1.5 Organize Project Structure
Create the following directory structure:
```
onboarding-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── index.js
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
└── IMPLEMENTATION_PLAN.md
```

#### 1.6 Refactor Existing Code
Move current [`index.js`](c:/Users/trent/OneDrive/Desktop/Portfolio/onboarding-platform/backend/index.js) logic into organized structure:
- Routes → `src/routes/applications.js`
- Controllers → `src/controllers/applicationController.js`
- Server setup → `src/index.js`

**Deliverables:**
- ✅ Git repository initialized
- ✅ Code pushed to GitHub
- ✅ Organized project structure
- ✅ Refactored codebase

---

## Phase 2: Database Integration - PostgreSQL Setup & Schema Design

### Objectives
- Install and configure PostgreSQL locally
- Design normalized database schema
- Set up database connection and migrations

### Tasks

#### 2.1 Install PostgreSQL (Windows)
1. Download PostgreSQL from official website
2. Install with default settings
3. Note down password for `postgres` user
4. Verify installation:
```bash
psql --version
```

#### 2.2 Create Database
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE onboarding_platform;

-- Create user (optional, for security)
CREATE USER onboarding_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE onboarding_platform TO onboarding_user;
```

#### 2.3 Install Database Dependencies
```bash
cd backend
npm install pg dotenv
npm install --save-dev node-pg-migrate
```

#### 2.4 Configure Environment Variables
Create `backend/.env`:
```
PORT=3000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/onboarding_platform
NODE_ENV=development
```

Create `backend/.env.example` (for GitHub):
```
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
NODE_ENV=development
```

#### 2.5 Design Database Schema

**Tables:**

**users** (for future authentication)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**applications**
```sql
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  product_type VARCHAR(50) DEFAULT 'checking',
  status VARCHAR(50) DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**documents** (for future file uploads)
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_path VARCHAR(500),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.6 Create Database Connection Module
Create `backend/src/config/database.js`:
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
```

#### 2.7 Create Migration Files
Create `backend/migrations/001_initial_schema.sql`:
```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  product_type VARCHAR(50) DEFAULT 'checking',
  status VARCHAR(50) DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_path VARCHAR(500),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_users_email ON users(email);
```

#### 2.8 Run Migrations
Create migration script in `package.json`:
```json
"scripts": {
  "migrate": "node scripts/migrate.js",
  "test": "jest",
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

Create `backend/scripts/migrate.js`:
```javascript
const fs = require('fs');
const path = require('path');
const pool = require('../src/config/database');

async function runMigrations() {
  try {
    const migrationFile = path.join(__dirname, '../migrations/001_initial_schema.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    await pool.query(sql);
    console.log('✅ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
```

Run migrations:
```bash
npm run migrate
```

**Deliverables:**
- ✅ PostgreSQL installed and running
- ✅ Database created with proper schema
- ✅ Database connection configured
- ✅ Migrations system in place

---

## Phase 3: Database Migration - Replace In-Memory Storage

### Objectives
- Replace in-memory arrays with PostgreSQL queries
- Maintain existing API contract
- Ensure data persistence

### Tasks

#### 3.1 Create Data Access Layer
Create `backend/src/models/Application.js`:
```javascript
const pool = require('../config/database');

class Application {
  static async create({ firstName, lastName, email, productType = 'checking' }) {
    const query = `
      INSERT INTO applications (first_name, last_name, email, product_type, status)
      VALUES ($1, $2, $3, $4, 'submitted')
      RETURNING id, first_name, last_name, email, product_type, status, created_at
    `;
    
    const values = [firstName, lastName, email, productType];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT id, first_name, last_name, email, product_type, status, created_at
      FROM applications
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, first_name, last_name, email, product_type, status, created_at
      FROM applications
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE applications
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, status, updated_at
    `;
    
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }
}

module.exports = Application;
```

#### 3.2 Update Controllers
Create `backend/src/controllers/applicationController.js`:
```javascript
const Application = require('../models/Application');

exports.createApplication = async (req, res, next) => {
  try {
    const { firstName, lastName, email, productType } = req.body;

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['firstName', 'lastName', 'email']
      });
    }

    // Create application
    const application = await Application.create({
      firstName,
      lastName,
      email,
      productType
    });

    res.status(201).json({
      applicationId: application.id,
      status: application.status
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.findAll();
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

exports.getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};
```

#### 3.3 Update Routes
Create `backend/src/routes/applications.js`:
```javascript
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/', applicationController.createApplication);
router.get('/', applicationController.getAllApplications);
router.get('/:id', applicationController.getApplicationById);

module.exports = router;
```

#### 3.4 Update Main Server File
Update `backend/src/index.js`:
```javascript
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const applicationRoutes = require('./routes/applications');

const app = express();
app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/applications', applicationRoutes);
app.use('/admin/applications', applicationRoutes); // Alias for admin

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing
```

#### 3.5 Test Database Integration
Manual testing:
```bash
# Start server
npm run dev

# Test POST endpoint
curl -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com"}'

# Test GET endpoint
curl http://localhost:3000/admin/applications
```

#### 3.6 Commit Changes
```bash
git add .
git commit -m "feat: Integrate PostgreSQL database, replace in-memory storage"
git push origin main
```

**Deliverables:**
- ✅ Data access layer implemented
- ✅ Controllers updated to use database
- ✅ All endpoints working with PostgreSQL
- ✅ Code committed to Git

---

## Phase 4: Testing Infrastructure - Jest Setup & Test Coverage

### Objectives
- Set up Jest testing framework
- Write unit tests for models and controllers
- Write integration tests for API endpoints
- Achieve 80%+ test coverage

### Tasks

#### 4.1 Install Testing Dependencies
```bash
npm install --save-dev jest supertest
```

#### 4.2 Configure Jest
Update `backend/package.json`:
```json
{
  "scripts": {
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/index.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

#### 4.3 Create Test Database Setup
Create `backend/tests/setup.js`:
```javascript
const pool = require('../src/config/database');

beforeAll(async () => {
  // Create test tables or use separate test database
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  // Clear test data before each test
  await pool.query('DELETE FROM applications');
});
```

#### 4.4 Write Unit Tests for Models
Create `backend/tests/unit/models/Application.test.js`:
```javascript
const Application = require('../../../src/models/Application');
const pool = require('../../../src/config/database');

describe('Application Model', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM applications');
  });

  describe('create', () => {
    it('should create a new application', async () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      const application = await Application.create(data);

      expect(application).toHaveProperty('id');
      expect(application.first_name).toBe('John');
      expect(application.last_name).toBe('Doe');
      expect(application.email).toBe('john@example.com');
      expect(application.status).toBe('submitted');
      expect(application.product_type).toBe('checking');
    });

    it('should use custom product type if provided', async () => {
      const data = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        productType: 'savings'
      };

      const application = await Application.create(data);
      expect(application.product_type).toBe('savings');
    });
  });

  describe('findAll', () => {
    it('should return all applications', async () => {
      await Application.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      });
      await Application.create({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com'
      });

      const applications = await Application.findAll();
      expect(applications).toHaveLength(2);
    });

    it('should return empty array when no applications exist', async () => {
      const applications = await Application.findAll();
      expect(applications).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should return application by id', async () => {
      const created = await Application.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      });

      const found = await Application.findById(created.id);
      expect(found.id).toBe(created.id);
      expect(found.email).toBe('john@example.com');
    });

    it('should return undefined for non-existent id', async () => {
      const found = await Application.findById(99999);
      expect(found).toBeUndefined();
    });
  });
});
```

#### 4.5 Write Integration Tests for API
Create `backend/tests/integration/applications.test.js`:
```javascript
const request = require('supertest');
const app = require('../../src/index');
const pool = require('../../src/config/database');

describe('Applications API', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM applications');
  });

  describe('POST /applications', () => {
    it('should create a new application', async () => {
      const response = await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        })
        .expect(201);

      expect(response.body).toHaveProperty('applicationId');
      expect(response.body.status).toBe('submitted');
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/applications')
        .send({
          firstName: 'John'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /admin/applications', () => {
    it('should return all applications', async () => {
      await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        });

      const response = await request(app)
        .get('/admin/applications')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
    });
  });
});
```

#### 4.6 Run Tests
```bash
npm test
```

#### 4.7 Commit Testing Infrastructure
```bash
git add .
git commit -m "test: Add Jest testing infrastructure with 80%+ coverage"
git push origin main
```

**Deliverables:**
- ✅ Jest configured and running
- ✅ Unit tests for models
- ✅ Integration tests for API endpoints
- ✅ 80%+ test coverage achieved

---

## Phase 5: Authentication & Security - JWT Implementation

### Objectives
- Implement JWT-based authentication
- Add user registration and login endpoints
- Protect admin routes with authentication
- Hash passwords securely

### Tasks

#### 5.1 Install Authentication Dependencies
```bash
npm install jsonwebtoken bcrypt
```

#### 5.2 Update Environment Variables
Add to `backend/.env`:
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

#### 5.3 Create User Model
Create `backend/src/models/User.js`:
```javascript
const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async create({ email, password, role = 'customer' }) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role, created_at
    `;
    
    const result = await pool.query(query, [email, passwordHash, role]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
```

#### 5.4 Create Authentication Controller
Create `backend/src/controllers/authController.js`:
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user
    const user = await User.create({ email, password, role });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Validate password
    const isValid = await User.validatePassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
```

#### 5.5 Create Authentication Middleware
Create `backend/src/middleware/auth.js`:
```javascript
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
```

#### 5.6 Create Auth Routes
Create `backend/src/routes/auth.js`:
```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
```

#### 5.7 Protect Admin Routes
Update `backend/src/index.js`:
```javascript
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const { authenticate, authorize } = require('./middleware/auth');

const app = express();
app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth routes (public)
app.use('/auth', authRoutes);

// Application routes (public for creation)
app.post('/applications', applicationRoutes);

// Admin routes (protected)
app.use('/admin/applications', authenticate, authorize('admin'), applicationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

#### 5.8 Write Authentication Tests
Create `backend/tests/integration/auth.test.js`:
```javascript
const request = require('supertest');
const app = require('../../src/index');
const pool = require('../../src/config/database');

describe('Authentication API', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM users');
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not allow duplicate emails', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password456'
        })
        .expect(409);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });
});
```

#### 5.9 Commit Authentication
```bash
git add .
git commit -m "feat: Add JWT authentication with user registration and login"
git push origin main
```

**Deliverables:**
- ✅ JWT authentication implemented
- ✅ User registration and login endpoints
- ✅ Protected admin routes
- ✅ Password hashing with bcrypt
- ✅ Authentication tests passing

---

## Phase 6: Error Handling & Validation - Production-Grade Patterns

### Objectives
- Implement centralized error handling
- Add input validation
- Improve error messages
- Add request logging

### Tasks

#### 6.1 Install Validation Dependencies
```bash
npm install express-validator morgan
```

#### 6.2 Create Custom Error Classes
Create `backend/src/utils/errors.js`:
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError
};
```

#### 6.3 Create Validation Middleware
Create `backend/src/middleware/validation.js`:
```javascript