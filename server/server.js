import express from "express"
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./configs/db.js";
import session from "express-session";
import MongoStore from 'connect-mongo';
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from "./routes/ThumbnailRouter.js";
import UserRouter from "./routes/UserRoute.js";
import TestimonialRouter from "./routes/TestimonialRoute.js";

const app = express()
app.use(express.json());

// Trust proxy for secure cookies in production (Required for Render, Heroku, etc.)
app.set('trust proxy', 1);

app.use(cors({
    origin:['http://localhost:5173', 'http://localhost:3000', 'https://prime-thumb-ai.vercel.app'],
    credentials:true
}))

// Initialize and start server
async function startServer() {
    try {
        await connectDB()
        
        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: { 
                maxAge: 1000*60*60*24*7, // 7 days
                secure: process.env.NODE_ENV === 'production', // true in production
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // 'none' for cross-site
            },
            store: MongoStore.create({
                client: mongoose.connection.getClient(),
                collectionName: 'session',
            })
        }))

        app.get('/', (req, res) => res.send("API is working fine"))
        app.use('/api/auth', AuthRouter)
        app.use('/api/thumbnail', ThumbnailRouter)
        app.use('/api/user', UserRouter)
        app.use('/api/testimonials', TestimonialRouter)


        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()