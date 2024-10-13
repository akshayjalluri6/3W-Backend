import pool from "../db/db.js";

const ImagesModel = {
    async createImagesTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS images (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            image_data BYTEA NOT NULL,
            user_id UUID,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `;

        try {
            await pool.query(query);
            console.log("Images Table created successfully");
        } catch (error) {
            console.log("Error while creating images table: ", error);
            throw error;
        }
    },

    async postImage(image_data, user_id) {
        const query = `
        INSERT INTO images (image_data, user_id) 
        VALUES ($1, $2)
        RETURNING *;
        `;

        try {
            const values = [image_data, user_id]
            const result = await pool.query(query, values)
            return result.rows[0]
        } catch (error) {
            console.log("Error while posting image: ", error)
            throw error
        }
    },

    async getImages() {
        const query = `
        SELECT * FROM images;
        `;
    
        try {
            const result = await pool.query(query);
            const images = result.rows.map((image) => {
                const base64Image = image.image_data.toString('base64');
                return {
                    ...image,
                    image_data: `data:image/png;base64,${base64Image}`
                };
            });
            return images;
        } catch (error) {
            console.log("Error while getting images: ", error);
            throw error;
        }
    },

    async getImage(user_id) {
        const query = `
        SELECT * FROM images WHERE user_id = $1;
        `;

        try {
            const values = [user_id]
            const result = await pool.query(query, values)
            const image = result.rows.map((image) => {
                const base64Image = image.image_data.toString('base64');
                return {
                    ...image,
                    image_data: `data:image/png;base64,${base64Image}`
                };
            });
            return image
        } catch (error) {
            console.log("Error while getting image: ", error)
            throw error
        }
    } 
    
}


export default ImagesModel