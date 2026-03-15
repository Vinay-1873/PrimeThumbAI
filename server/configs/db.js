import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB already connected');
            return;
        }
        
        mongoose.connection.on('connected', () => console.log('MongoDB connected Successfully'))
        mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err))
        
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        throw new Error(`Failed to connect to MongoDB: ${error.message}`)
    }
}

export default connectDB;