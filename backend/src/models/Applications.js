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
    