import pool from "../db/db.js";

const UserModel = {
    async createUserTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            social_media_handle VARCHAR(255) NOT NULL,
            UNIQUE(username, social_media_handle)
        );
        `;

        try {
            await pool.query(query)
            console.log("User Table created successfully")            
        } catch (error) {
            console.log("Error while creating table: ", error)
            throw error
        }
    },

    async createUser(username, social_media_handle) {
        const query = `
        INSERT INTO users (username, social_media_handle) 
        VALUES ($1, $2) 
        RETURNING *;
        `;

        try {
            const values = [username, social_media_handle]
            const result = await pool.query(query, values)
            return result.rows[0]
        } catch (error) {
            console.log("Error while creating user: ", error)
            throw error
        }

    },

    async checkUser(username, social_media_handle) {
        const query = `
        SELECT * FROM users
        WHERE username = $1 AND social_media_handle = $2;
        `;

        try {
            const values = [username, social_media_handle]
            const result = await pool.query(query, values)
            return result.rows[0]
        } catch (error) {
            console.log("Error while checking user: ", error)
            throw error
        }

    },

    async getUsers() {
        const query = `
        SELECT DISTINCT username FROM users ORDER BY username;
        `;

        try {
            const result = await pool.query(query)
            return result.rows
        } catch (error) {
            console.log("Error while getting users: ", error)
            throw error
        }
    },

    async getUser(username) {
        const query = `
        SELECT * FROM users WHERE username = $1;
        `;

        try {
            const values = [username]
            const result = await pool.query(query, values)
            return result.rows
        } catch (error) {
            console.log("Error while getting user: ", error)
            throw error
        }

    },
    
}

export default UserModel