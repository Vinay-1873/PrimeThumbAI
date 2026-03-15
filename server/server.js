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
import MessageRouter from "./routes/MessageRoute.js";
import PaymentRouter from "./routes/PaymentRoute.js";
import LoraRouter from "./routes/LoraRoute.js";
import { stripeWebhook } from "./controller/PaymentController.js";

const app = express()

// Stripe webhook needs raw body, so we mount it BEFORE express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());

// Trust proxy for secure cookies in production (Required for Render, Heroku, etc.)
app.set('trust proxy', 1);

app.use(cors({
    origin:['http://localhost:5173', 'http://localhost:3000', 'https://prime-thumb-ai.vercel.app'],
    credentials:true
}))

// Initialize database and middleware
let isInitialized = false;

async function initializeServer() {
    if (isInitialized) return;
    
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
        app.use('/api/message', MessageRouter)
        app.use('/api/payment', PaymentRouter)
        app.use('/api/lora', LoraRouter)
        
        isInitialized = true;
        console.log('Server initialized successfully');
    } catch (error) {
        console.error('Failed to initialize server:', error)
        throw error;
    }
}

// For local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    initializeServer()
        .then(() => {
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
        })
        .catch(err => {
            console.error('Failed to start server:', err)
            process.exit(1)
        })
}

// For Vercel serverless, initialize on first request
app.use(async (req, res, next) => {
    if (!isInitialized) {
        await initializeServer();
    }
    next();
})

export default app;