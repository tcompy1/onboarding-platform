# Troubleshooting Guide - Refactoring Error

## 🐛 Error You Encountered

```
TypeError: argument handler must be a function
    at Route.<computed> [as get] (C:\Users\trent\OneDrive\Desktop\Portfolio\onboarding-platform\backend\node_modules\router\lib\route.js:228:15)
```

## 🔍 Root Cause

In your [`backend/src/routes/applications.js`](backend/src/routes/applications.js) file on **line 9**, you have:

```javascript
router.get('/', applicationController.getApplications);
```

But in your controller file [`backend/src/controllers/applicationControllers.js`](backend/src/controllers/applicationControllers.js), the function is exported as:

```javascript
exports.getAllApplications = (req, res) => { ... }
```

**The function names don't match!**
- Routes file calls: `getApplications` 
- Controller exports: `getAllApplications`

## ✅ The Fix

**File to edit:** `backend/src/routes/applications.js`

**Change line 9 from:**
```javascript
router.get('/', applicationController.getApplications);
```

**To:**
```javascript
router.get('/', applicationController.getAllApplications);
```

## 📝 Complete Corrected File

Your `backend/src/routes/applications.js` should look exactly like this:

```javascript
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationControllers');

// POST /applications - Create new application
router.post('/', applicationController.createApplication);

// GET /applications - Get all applications (will be used for admin)
router.get('/', applicationController.getAllApplications);  // ← FIXED: Added "All"

module.exports = router;
```

## 🚀 Steps to Fix

1. **Open** `backend/src/routes/applications.js` in VS Code
2. **Find** line 9: `router.get('/', applicationController.getApplications);`
3. **Change** `getApplications` to `getAllApplications`
4. **Save** the file (Ctrl+S)
5. **Watch** nodemon automatically restart the server
6. **Test** the endpoints

## 🧪 Testing After Fix

Once you've made the change, test all endpoints:

```bash
# 1. Test health check
curl http://localhost:3000/health

# Expected response:
# {"status":"ok"}

# 2. Test creating an application
curl -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\"}"

# Expected response:
# {"applicationId":1,"status":"submitted"}

# 3. Test getting all applications
curl http://localhost:3000/admin/applications

# Expected response:
# [{"id":1,"firstName":"John","lastName":"Doe","email":"john@example.com","productType":"checking","status":"submitted"}]
```

## 💡 Why This Happened

This is a common mistake when refactoring! The error occurs because:

1. Express router expects a **function** as the second argument
2. When you write `applicationController.getApplications`, JavaScript tries to find that property
3. Since `getApplications` doesn't exist on the controller object, it returns `undefined`
4. Express receives `undefined` instead of a function
5. Express throws the error: "argument handler must be a function"

## 🎓 Learning Point

Always make sure:
- Function names in routes match the exported function names in controllers
- Use consistent naming conventions (e.g., always use `getAllApplications` not sometimes `getApplications`)
- Check for typos in function names

## ✅ Verification Checklist

After making the fix:
- [ ] Changed `getApplications` to `getAllApplications` in routes file
- [ ] Saved the file
- [ ] Server restarted without errors
- [ ] Health check endpoint works
- [ ] POST /applications works
- [ ] GET /admin/applications works
- [ ] No errors in console

## 🎯 Next Steps

Once this is working:

1. **Test all endpoints** to make sure everything works
2. **Commit your changes:**
   ```bash
   git add .
   git commit -m "refactor: Organize code into controllers and routes"
   ```
3. **Move to Phase 1.5** in the COMPLETE_ROADMAP.md
4. **Continue with Git setup** and initial push to GitHub

---

**Remember:** This type of debugging is normal and valuable! You're learning to read error messages and trace issues through your code - an essential skill for any developer.
