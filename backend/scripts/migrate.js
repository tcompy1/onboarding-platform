const fs = require('fs');
const path = require('path');
const pool = require('../src/config/database');

async function runMigrations() {
    try {
        console.log('🔄 Running database migrations...');

        const migrationFile = path.join(__dirname, '../migrations/001_initial_schemal.sql');
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