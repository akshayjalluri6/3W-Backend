import pool from "../db/db.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const secretKey = process.env.SECRET_KEY || 'secretKey'

const AdminModel = {
    async createAdminTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS admin (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
        );
        `;

        try {
            const result = await pool.query(query)
            console.log("Admin Table created successfully")
        } catch (error) {
            console.log("Error while creating admin table: ", error)
            throw error
        }
    },

    async createAdmin(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const query = `
        INSERT INTO admin (username, password) 
        VALUES ($1, $2)
        RETURNING *;
        `;

        try {
            const values = [username, hashedPassword]
            const result = await pool.query(query, values)
            console.log(result)
            return result.rows[0]
        } catch (error) {
            console.log("Error while creating admin: ", error)
            throw error
        }
    },

    async checkAdmin(username, password) {
        const query = `
        SELECT * FROM admin
        WHERE username = $1;
        `;
    
        try {
            const user = await pool.query(query, [username]);
    
            // Check if user exists
            if (user.rows.length === 0) {
                throw new Error("Invalid username");
            }
    
            // Verify password
            const validPassword = await bcrypt.compare(password, user.rows[0].password);
            if (!validPassword) {
                throw new Error("Invalid password");
            }
    
            // If username and password are correct, generate a JWT
            const payload = { username: user.rows[0].username };
            const jwtToken = jwt.sign(payload, secretKey, { expiresIn: "1h" });
            return jwtToken;
    
        } catch (error) {
            throw error;  // Pass the error back to the route handler
        }
    }
    
}

export default AdminModel