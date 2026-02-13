import Testimonial from "../models/Testimonial.js";
import User from "../models/User.js";

export const addTestimonial = async (req, res) => {
    try {
        const { quote, role } = req.body;
        const { userId } = req.session;

        if (!quote) {
            return res.status(400).json({ success: false, message: "Quote is required" });
        }

        const testimonial = new Testimonial({
            userId,
            quote,
            role: role || "User"
        });

        await testimonial.save();

        const populatedTestimonial = await Testimonial.findById(testimonial._id).populate("userId", "name");

        res.status(201).json({
            success: true,
            message: "Testimonial added successfully",
            testimonial: {
                quote: populatedTestimonial.quote,
                role: populatedTestimonial.role,
                name: populatedTestimonial.userId.name,
                // We don't store user images effectively yet, so we might fallback to initals on frontend or added image support later
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getTestimonials = async (req, res) => {
    try {
        // limit to latest 20 for example
        const testimonials = await Testimonial.find()
            .populate("userId", "name")
            .sort({ createdAt: -1 })
            .limit(20);

        const formattedTestimonials = testimonials.map(t => ({
            id: t._id,
            quote: t.quote,
            role: t.role,
            name: t.userId ? t.userId.name : "Anonymous",
            // Assuming no user image storage yet, frontend will generate initial-based avatar or use random
        }));

        res.status(200).json({ success: true, testimonials: formattedTestimonials });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
