# Database Connection Fix

## 🔍 Current Issue

Your `.env` file has:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORDtcompy1@localhost:5432/onboarding_platform
```

The password appears to be incorrect or malformed.

## ✅ How to Fix

### Step 1: Find Your PostgreSQL Password

This is the password you set when you installed PostgreSQL. If you don't remember it, you have two options:

**Option A: Reset the password**
1. Open Command Prompt as Administrator
2. Run: `psql -U postgres`
3. If it asks for a password and you don't know it, you'll need to reset it

**Option B: Use a different authentication method**
See below for trust authentication (development only)

### Step 2: Update Your .env File

**Open:** `backend/.env`

**Replace line 2 with your actual password:**
```
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/onboarding_platform
```

**Example (if your password is "mypassword123"):**
```
DATABASE_URL=postgresql://postgres:mypassword123@localhost:5432/onboarding_platform
```

### Step 3: Test the Connection

```bash
npm run migrate
```

## 🔧 Alternative: Use Trust Authentication (Development Only)

If you're having trouble with passwords, you can temporarily use trust authentication:

### Step 1: Find pg_hba.conf

Location on Windows:
```
C:\Program Files\PostgreSQL\[VERSION]\data\pg_hba.conf
```

### Step 2: Edit pg_hba.conf

Open as Administrator and find this line:
```
host    all             all             127.0.0.1/32            scram-sha-256
```

Change to:
```
host    all             all             127.0.0.1/32            trust
```

### Step 3: Restart PostgreSQL

```bash
# In Command Prompt as Administrator
net stop postgresql-x64-[VERSION]
net start postgresql-x64-[VERSION]
```

### Step 4: Update .env

```
DATABASE_URL=postgresql://postgres@localhost:5432/onboarding_platform
```

(No password needed with trust authentication)

## 🧪 Test Your Connection

### Method 1: Using psql

```bash
psql -U postgres -d onboarding_platform
```

If this works without asking for a password (or accepts your password), your connection is good.

### Method 2: Using the migration script

```bash
npm run migrate
```

Should output:
```
🔄 Running database migrations...
✅ Migrations completed successfully
```

## 🔐 Security Note

**Trust authentication should ONLY be used for local development!**

For production or when you're done with initial setup, always use password authentication:
1. Change pg_hba.conf back to `scram-sha-256`
2. Set a strong password
3. Update your .env file with the password

## 📋 Common DATABASE_URL Formats

**With password:**
```
postgresql://username:password@host:port/database
```

**Without password (trust auth):**
```
postgresql://username@host:port/database
```

**With special characters in password:**
If your password has special characters like `@`, `#`, `:`, etc., you need to URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `:` becomes `%3A`

Example: Password `my@pass#123` becomes:
```
postgresql://postgres:my%40pass%23123@localhost:5432/onboarding_platform
```

## ✅ Next Steps

Once your connection works:

1. **Verify tables were created:**
   ```bash
   psql -U postgres -d onboarding_platform
   \dt
   ```
   
   Should show:
   - users
   - applications
   - documents

2. **Continue to Phase 3** of the roadmap

3. **Commit your changes** (but NOT the .env file!)
   ```bash
   git add .
   git commit -m "feat: Add database configuration and migrations"
   ```

---

**Need more help?** Check if PostgreSQL is running:
```bash
# Windows
sc query postgresql-x64-[VERSION]
```

If it's not running:
```bash
net start postgresql-x64-[VERSION]
```
