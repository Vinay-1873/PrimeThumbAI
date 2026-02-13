import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    quote: {
        type: String,
        required: true,
        trim: true,
        maxLength: 300
    },
    role: {
        type: String,
        default: "User",
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
