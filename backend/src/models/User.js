const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create({ email, password, role = 'customer' }) {
        const passwordHash = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (email, password_hash, role)
            VALUES ($1, $2, $3)
            RETURNING id, email, role, created_at AS "createdAT"
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