# Onboarding Platform - Complete Implementation Roadmap

## 🎯 Project Overview

**Goal:** Transform the current basic Express API into a production-grade fintech onboarding platform that demonstrates professional backend development skills.

**Current State:**
- ✅ Basic Express server with 3 endpoints
- ✅ In-memory data storage
- ❌ No database integration
- ❌ No testing
- ❌ No authentication
- ❌ No deployment

**Target State:**
- ✅ PostgreSQL database integration
- ✅ JWT authentication
- ✅ 85%+ test coverage with Jest
- ✅ Comprehensive error handling
- ✅ Deployed and accessible
- ✅ Professional documentation

**Strategic Value:** This project unlocks job opportunities at:
- **Codevista** (Junior Node.js Developer) - Direct match
- **SpruceID** (Full-Stack Engineer) - Backend focus
- **Halvik** (Junior Full-Stack Developer) - Node.js/PostgreSQL

---

## 📋 Implementation Phases

### Phase 1: Foundation Setup - Git & Project Structure
**Time Estimate:** 2-3 hours
**Priority:** CRITICAL

#### What You'll Build
- Git repository with professional workflow
- Organized project structure
- Refactored codebase with separation of concerns

#### Step-by-Step Tasks

**1.1 Initialize Git Repository**
```bash
cd c:/Users/trent/OneDrive/Desktop/Portfolio/onboarding-platform
git init
```

**1.2 Create .gitignore**
```
node_modules/
.env
.env.local
*.log
.DS_Store
coverage/
dist/
build/
.vscode/
```

**1.3 Organize Project Structure**
Create this structure:
```
onboarding-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, environment config
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Data access layer
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── utils/           # Helper functions
│   │   └── index.js         # Server entry point
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── migrations/          # Database migrations
│   ├── scripts/             # Utility scripts
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
├── COMPLETE_ROADMAP.md
└── IMPLEMENTATION_PLAN.md
```

**1.4 Refactor Current Code**
Move logic from `backend/index.js` into organized structure:
- Create `src/routes/applications.js` for routes
- Create `src/controllers/applicationController.js` for business logic
- Update `src/index.js` to use new structure

**1.5 Initial Commit**
```bash
git add .
git commit -m "Initial commit: Basic Express API with organized structure"
```

**1.6 Create GitHub Repository**
```bash
# Create repo on GitHub, then:
git remote add origin https://github.com/[your-username]/onboarding-platform.git
git branch -M main
git push -u origin main
```

#### Success Criteria
- ✅ Git repository initialized and pushed to GitHub
- ✅ Code organized into logical directories
- ✅ Separation of concerns (routes, controllers, models)

---

### Phase 2: Database Integration - PostgreSQL Setup
**Time Estimate:** 4-6 hours
**Priority:** CRITICAL

#### What You'll Build
- PostgreSQL database with normalized schema
- Database connection and configuration
- Migration system for schema management

#### Step-by-Step Tasks

**2.1 Install PostgreSQL (Windows)**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer with default settings
3. Set password for `postgres` user (remember this!)
4. Verify installation:
```bash
psql --version
```

**2.2 Create Database**
```bash
# Open Command Prompt as Administrator
psql -U postgres

# In PostgreSQL prompt:
CREATE DATABASE onboarding_platform;
\q
```

**2.3 Install Dependencies**
```bash
cd backend
npm install pg dotenv
```

**2.4 Create Environment Configuration**

Create `backend/.env`:
```
PORT=3000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/onboarding_platform
NODE_ENV=development
```

Create `backend/.env.example`:
```
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
NODE_ENV=development
```

**2.5 Create Database Connection**

Create `backend/src/config/database.js`:
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

module.exports = pool;
```

**2.6 Design Database Schema**

Create `backend/migrations/001_initial_schema.sql`:
```sql
-- Users table (for authentication)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table
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

-- Documents table (for future file uploads)
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_path VARCHAR(500),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_users_email ON users(email);
```

**2.7 Create Migration Script**

Create `backend/scripts/migrate.js`:
```javascript
const fs = require('fs');
const path = require('path');
const pool = require('../src/config/database');

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    const migrationFile = path.join(__dirname, '../migrations/001_initial_schema.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    await pool.query(sql);
    
    console.log('✅ Migrations completed successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();
```

**2.8 Update package.json**
Add migration script:
```json
{
  "scripts": {
    "migrate": "node scripts/migrate.js",
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

**2.9 Run Migrations**
```bash
npm run migrate
```

**2.10 Commit Database Setup**
```bash
git add .
git commit -m "feat: Add PostgreSQL database configuration and schema"
git push origin main
```

#### Success Criteria
- ✅ PostgreSQL installed and running
- ✅ Database created with proper schema
- ✅ Database connection working
- ✅ Migration system in place

---

### Phase 3: Replace In-Memory Storage with PostgreSQL
**Time Estimate:** 3-4 hours
**Priority:** CRITICAL

#### What You'll Build
- Data access layer (models)
- Updated controllers to use database
- All endpoints working with PostgreSQL

#### Step-by-Step Tasks

**3.1 Create Application Model**

Create `backend/src/models/Application.js`:
```javascript
const pool = require('../config/database');

class Application {
  static async create({ firstName, lastName, email, productType = 'checking' }) {
    const query = `
      INSERT INTO applications (first_name, last_name, email, product_type, status)
      VALUES ($1, $2, $3, $4, 'submitted')
      RETURNING id, first_name AS "firstName", last_name AS "lastName", 
                email, product_type AS "productType", status, created_at AS "createdAt"
    `;
    
    const values = [firstName, lastName, email, productType];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT id, first_name AS "firstName", last_name AS "lastName", 
             email, product_type AS "productType", status, created_at AS "createdAt"
      FROM applications
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, first_name AS "firstName", last_name AS "lastName", 
             email, product_type AS "productType", status, created_at AS "createdAt"
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
      RETURNING id, status, updated_at AS "updatedAt"
    `;
    
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM applications WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Application;
```

**3.2 Create Application Controller**

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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
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

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['submitted', 'under_review', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        validStatuses 
      });
    }

    const application = await Application.updateStatus(id, status);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};
```

**3.3 Create Application Routes**

Create `backend/src/routes/applications.js`:
```javascript
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// Public routes
router.post('/', applicationController.createApplication);

// Admin routes (will be protected later)
router.get('/', applicationController.getAllApplications);
router.get('/:id', applicationController.getApplicationById);
router.put('/:id/status', applicationController.updateApplicationStatus);

module.exports = router;
```

**3.4 Update Main Server File**

Update `backend/src/index.js`:
```javascript
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const applicationRoutes = require('./routes/applications');

const app = express();

// Middleware
app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.post('/applications', applicationRoutes);
app.use('/admin/applications', applicationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app; // For testing
```

**3.5 Test the API**
```bash
# Start server
npm run dev

# Test POST endpoint
curl -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\"}"

# Test GET endpoint
curl http://localhost:3000/admin/applications
```

**3.6 Commit Database Integration**
```bash
git add .
git commit -m "feat: Replace in-memory storage with PostgreSQL"
git push origin main
```

#### Success Criteria
- ✅ All endpoints working with PostgreSQL
- ✅ Data persists across server restarts
- ✅ Clean separation of concerns (models, controllers, routes)

---

### Phase 4: Testing Infrastructure - Jest & Test Coverage
**Time Estimate:** 4-5 hours
**Priority:** CRITICAL

#### What You'll Build
- Jest testing framework
- Unit tests for models
- Integration tests for API endpoints
- 80%+ test coverage

#### Step-by-Step Tasks

**4.1 Install Testing Dependencies**
```bash
npm install --save-dev jest supertest
```

**4.2 Configure Jest**

Update `backend/package.json`:
```json
{
  "scripts": {
    "test": "jest --coverage --runInBand",
    "test:watch": "jest --watch",
    "test:unit": "jest tests/unit --runInBand",
    "test:integration": "jest tests/integration --runInBand",
    "migrate": "node scripts/migrate.js",
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/index.js",
      "!src/config/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    },
    "testMatch": [
      "**/tests/**/*.test.js"
    ]
  }
}
```

**4.3 Create Test Setup**

Create `backend/tests/setup.js`:
```javascript
const pool = require('../src/config/database');

// Clean up database before each test
beforeEach(async () => {
  await pool.query('DELETE FROM applications');
  await pool.query('DELETE FROM users');
});

// Close database connection after all tests
afterAll(async () => {
  await pool.end();
});
```

**4.4 Write Unit Tests for Application Model**

Create `backend/tests/unit/models/Application.test.js`:
```javascript
const Application = require('../../../src/models/Application');
const pool = require('../../../src/config/database');

describe('Application Model', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM applications');
  });

  describe('create', () => {
    it('should create a new application with required fields', async () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      const application = await Application.create(data);

      expect(application).toHaveProperty('id');
      expect(application.firstName).toBe('John');
      expect(application.lastName).toBe('Doe');
      expect(application.email).toBe('john@example.com');
      expect(application.status).toBe('submitted');
      expect(application.productType).toBe('checking');
    });

    it('should use custom product type if provided', async () => {
      const data = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        productType: 'savings'
      };

      const application = await Application.create(data);
      expect(application.productType).toBe('savings');
    });
  });

  describe('findAll', () => {
    it('should return all applications ordered by creation date', async () => {
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
      expect(applications[0].firstName).toBe('Jane'); // Most recent first
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

  describe('updateStatus', () => {
    it('should update application status', async () => {
      const created = await Application.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      });

      const updated = await Application.updateStatus(created.id, 'approved');
      expect(updated.status).toBe('approved');
    });
  });
});
```

**4.5 Write Integration Tests for API**

Create `backend/tests/integration/applications.test.js`:
```javascript
const request = require('supertest');
const app = require('../../src/index');
const pool = require('../../src/config/database');

describe('Applications API', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM applications');
  });

  afterAll(async () => {
    await pool.end();
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

    it('should return 400 for missing firstName', async () => {
      const response = await request(app)
        .post('/applications')
        .send({
          lastName: 'Doe',
          email: 'john@example.com'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email'
        })
        .expect(400);

      expect(response.body.error).toBe('Invalid email format');
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
      expect(response.body[0].firstName).toBe('John');
    });

    it('should return empty array when no applications exist', async () => {
      const response = await request(app)
        .get('/admin/applications')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /admin/applications/:id', () => {
    it('should return application by id', async () => {
      const createResponse = await request(app)
        .post('/applications')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        });

      const id = createResponse.body.applicationId;

      const response = await request(app)
        .get(`/admin/applications/${id}`)
        .expect(200);

      expect(response.body.id).toBe(id);
      expect(response.body.firstName).toBe('John');
    });

    it('should return 404 for non-existent id', async () => {
      await request(app)
        .get('/admin/applications/99999')
        .expect(404);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
```

**4.6 Run Tests**
```bash
npm test
```

**4.7 Commit Testing Infrastructure**
```bash
git add .
git commit -m "test: Add Jest testing with 80%+ coverage"
git push origin main
```

#### Success Criteria
- ✅ Jest configured and running
- ✅ Unit tests for models passing
- ✅ Integration tests for API passing
- ✅ 80%+ test coverage achieved

---

### Phase 5: Authentication & Security - JWT Implementation
**Time Estimate:** 4-5 hours
**Priority:** HIGH

#### What You'll Build
- User registration and login
- JWT token generation
- Protected admin routes
- Password hashing

#### Step-by-Step Tasks

**5.1 Install Dependencies**
```bash
npm install jsonwebtoken bcrypt
```

**5.2 Update Environment Variables**

Add to `backend/.env`:
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=24h
```

**5.3 Create User Model**

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
      RETURNING id, email, role, created_at AS "createdAt"
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

**5.4 Create Auth Controller**

Create `backend/src/controllers/authController.js`:
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password strength
    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters' 
      });
    }

    // Check if user exists
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

**5.5 Create Auth Middleware**

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
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Authentication failed' });
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

**5.6 Create Auth Routes**

Create `backend/src/routes/auth.js`:
```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;