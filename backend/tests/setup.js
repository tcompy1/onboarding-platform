const pool = require('../src/config/database');

//Clean up database before each test
beforeEach(async () => {
    await pool.query('DELETE FROM applications');
    await pool.query('DELETE FROM users');
});

// Close database connection after all tests
afterAll(async () => {
    await pool.end();
});