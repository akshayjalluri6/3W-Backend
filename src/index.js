import express from "express";
import cors from 'cors'
import {configDotenv} from 'dotenv'
import UserModel from "./models/UserModel.js";
import ImagesModel from "./models/ImagesModel.js";
import upload from "./middlewares/multer.middleware.js";
import AdminModel from "./models/AdminModel.js";
configDotenv()

const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 8081

app.post("/admin-register", async(req, res) => {
    const {username, password} = req.body

    try {
        const admin = await AdminModel.createAdmin(username, password)
        res.status(200).send(`Admin created successfully with id ${admin.id}`)
    } catch (error) {
        res.status(500).send("Error while registering admin: ", error)
    }
})

app.post("/admin-login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await AdminModel.checkAdmin(username, password);
        res.status(200).json({ message: "Admin logged in successfully", token });
    } catch (error) {
        // If the error is about invalid username or password, send an appropriate response
        if (error.message === "Invalid username") {
            res.status(400).json({ error: "Username not found" });
        } else if (error.message === "Invalid password") {
            res.status(400).json({ error: "Incorrect password" });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});


app.post("/post-images", upload.single('image'), async(req, res) => {
    const {username, social_media_handle} = req.body
    const image = req.file

    try {
        const user = await UserModel.checkUser(username, social_media_handle)
        if (user) {
            const imgUpload = await ImagesModel.postImage(image.buffer, user.id)
            res.status(200).send(`User ${user.id}, image ${imgUpload.id}`)
        } else {
            const newUser = await UserModel.createUser(username, social_media_handle)
            const imgUpload = await ImagesModel.postImage(image.buffer, newUser.id)
            res.status(200).send(`User ${newUser.id}, image ${imgUpload.id}`)
        }
    } catch (error) {
        res.status(500).send(`Error while posting image: ${error}`)
    }
})

app.get("/get-users", async (req, res) => {
    try {
        const users = await UserModel.getUsers();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).send("Error while getting users: ", error)
    }
} )

app.get("/get-user/:id", async(req, res) => {
    const {id} = req.params

    try {
        const result = await UserModel.getUser(id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).send(`Error while getting user: ${error}`)
    }
})


app.get("/get-images", async(req, res) => {
    try {
        const images = await ImagesModel.getImages();
        res.status(200).json(images);  // Return as JSON
    } catch (error) {
        res.status(500).send(`Error while getting images: ${error}`);
    }
});

app.get("/get-image/:id", async(req, res) => {
    const {id} = req.params
    try {
        const image = await ImagesModel.getImage(id)
        res.status(200).json(image)        
    } catch (error) {
        res.status(500).send(`Error while getting image: ${error}`)
    }
})





const initializeDBAndServer = async () => {
    try {
        await UserModel.createUserTable()
        await ImagesModel.createImagesTable()
        await AdminModel.createAdminTable()
        app.listen(port, () => {
            console.log(`Server is running on port http://localhost:${port}`)
        })
        
    } catch (error) {
        console.log("Error while initializing DB: ", error)
        process.exit(1)
    }
}

initializeDBAndServer()

