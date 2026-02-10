# Refactoring Guide - Phase 1.4

## 🎯 Goal
Split your current [`backend/index.js`](backend/index.js) into organized files following separation of concerns.

## 📋 Current Code Breakdown

Your current `index.js` has everything mixed together:
- ✅ Server setup (Express, middleware)
- ✅ Routes (GET /health, POST /applications, GET /admin/applications)
- ✅ Business logic (validation, data manipulation)
- ✅ Data storage (in-memory arrays)

We'll split this into:
- **Controllers** - Business logic and request handling
- **Routes** - URL mapping
- **Server** - Express setup and startup

## 📁 Step-by-Step Refactoring

### Step 1: Create Directory Structure

First, create these folders inside `backend/`:

```bash
cd backend
mkdir src
mkdir src\controllers
mkdir src\routes
```

### Step 2: Create the Controller

**Create:** `backend/src/controllers/applicationController.js`

This file contains the business logic (what happens when endpoints are called):

```javascript
// In-memory storage (temporary - will be replaced with database later)
const applications = [];
let nextId = 1;

// Handler for creating an application
exports.createApplication = (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Validation
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Create application object
  const application = {
    id: nextId++,
    firstName,
    lastName,
    email,
    productType: "checking",
    status: "submitted"
  };

  // Store in memory
  applications.push(application);

  // Send response
  res.status(201).json({ 
    applicationId: application.id, 
    status: application.status 
  });
};

// Handler for getting all applications
exports.getAllApplications = (req, res) => {
  res.json(applications);
};
```

**What changed:**
- Moved the `applications` array and `nextId` to the controller
- Wrapped the POST logic in `exports.createApplication` function
- Wrapped the GET logic in `exports.getAllApplications` function
- Changed `res.json()` to `res.status(201).json()` for POST (best practice)

### Step 3: Create the Routes

**Create:** `backend/src/routes/applications.js`

This file maps URLs to controller functions:

```javascript
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// POST /applications - Create new application
router.post('/', applicationController.createApplication);

// GET /applications - Get all applications (will be used for admin)
router.get('/', applicationController.getAllApplications);

module.exports = router;
```

**What this does:**
- Creates an Express router
- Maps POST `/` to the `createApplication` controller function
- Maps GET `/` to the `getAllApplications` controller function
- Exports the router so it can be used in the main server file

### Step 4: Update the Main Server File

**Create:** `backend/src/index.js` (new location!)

This is your new main server file:

```javascript
const express = require("express");
const bodyParser = require("body-parser");

// Import routes
const applicationRoutes = require('./routes/applications');

const app = express();

// Middleware
app.use(bodyParser.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Application routes
app.post('/applications', applicationRoutes);  // Public endpoint for creating
app.use('/admin/applications', applicationRoutes);  // Admin endpoint for viewing

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for testing (we'll use this later)
module.exports = app;
```

**What changed:**
- Removed all the application logic (now in controller)
- Imported the application routes
- Used `app.post('/applications', applicationRoutes)` for the create endpoint
- Used `app.use('/admin/applications', applicationRoutes)` for the admin endpoint
- Added `module.exports = app` for future testing

### Step 5: Update package.json

**Update:** `backend/package.json`

Change the `main` field and `start` script:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Onboarding Platform API",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "body-parser": "^2.2.2",
    "express": "^5.2.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**What changed:**
- `"main": "src/index.js"` - Points to new location
- `"start": "node src/index.js"` - Runs from new location
- Added `"dev"` script with nodemon for auto-restart during development
- Added nodemon to devDependencies (install it: `npm install --save-dev nodemon`)

### Step 6: Test the Refactored Code

```bash
# Install nodemon if you haven't
npm install --save-dev nodemon

# Start the server
npm run dev
```

Test the endpoints:

```bash
# Test health check
curl http://localhost:3000/health

# Test creating an application
curl -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\"}"

# Test getting all applications
curl http://localhost:3000/admin/applications
```

### Step 7: Clean Up Old File

Once everything works, you can delete or rename the old `backend/index.js`:

```bash
# Rename it as backup
mv backend/index.js backend/index.js.old

# Or delete it
# rm backend/index.js
```

## 📊 Before vs After

### Before (Everything in one file)
```
backend/
├── index.js (48 lines - everything mixed together)
├── package.json
└── package-lock.json
```

### After (Organized structure)
```
backend/
├── src/
│   ├── controllers/
│   │   └── applicationController.js (business logic)
│   ├── routes/
│   │   └── applications.js (URL mapping)
│   └── index.js (server setup)
├── package.json
├── package-lock.json
└── index.js.old (backup of old file)
```

## ✅ Verification Checklist

- [ ] Created `src/controllers/applicationController.js`
- [ ] Created `src/routes/applications.js`
- [ ] Created `src/index.js`
- [ ] Updated `package.json` scripts
- [ ] Installed nodemon: `npm install --save-dev nodemon`
- [ ] Server starts with `npm run dev`
- [ ] Health check works: `GET /health`
- [ ] Create application works: `POST /applications`
- [ ] Get applications works: `GET /admin/applications`
- [ ] Old `backend/index.js` renamed or deleted

## 🎯 What You've Accomplished

✅ **Separation of Concerns:** Each file has a single responsibility
✅ **Maintainability:** Easier to find and update code
✅ **Testability:** Controllers can be tested independently
✅ **Scalability:** Easy to add new routes and controllers
✅ **Professional Structure:** Follows industry best practices

## 🚀 Next Steps

After completing this refactoring:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "refactor: Organize code into controllers, routes, and server"
   ```

2. **Move to Phase 1.5:** Create `.gitignore` and make initial commit

3. **Then Phase 2:** Set up PostgreSQL database

## 💡 Understanding the Flow

When a request comes in, here's what happens:

```
1. Client Request
   POST /applications
   
2. Express Server (src/index.js)
   ↓ Matches route: app.post('/applications', applicationRoutes)
   
3. Router (src/routes/applications.js)
   ↓ Matches: router.post('/', ...)
   ↓ Calls: applicationController.createApplication
   
4. Controller (src/controllers/applicationController.js)
   ↓ Validates input
   ↓ Creates application object
   ↓ Stores in array
   ↓ Sends response
   
5. Response back to client
   { "applicationId": 1, "status": "submitted" }
```

## ❓ Common Issues

**Issue:** "Cannot find module './routes/applications'"
**Solution:** Make sure you created the file in the correct location: `backend/src/routes/applications.js`

**Issue:** "Server won't start"
**Solution:** Check that `package.json` has the correct path: `"main": "src/index.js"`

**Issue:** "Routes not working"
**Solution:** Make sure you're using `router.post('/', ...)` in the routes file (not `router.post('/applications', ...)`)

## 🎓 Key Concepts

**Controller:** Contains business logic - what to do when an endpoint is called
**Route:** Maps URLs to controller functions - which function handles which URL
**Separation of Concerns:** Each file has one job, making code easier to understand and maintain

---

You're doing great! This refactoring sets you up for success in all the future phases. Once this works, you'll be ready to add the database, testing, and authentication.
