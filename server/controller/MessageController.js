import Message from "../models/Message.js";
import nodemailer from "nodemailer";

export const sendMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newMessage = new Message({
            name,
            email,
            message
        });

        await newMessage.save();

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS // Use App Password for Gmail
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'd11s4got@gmail.com',
            replyTo: email, // Allows you to reply directly to the sender
            subject: `New Contact Form Submission from ${name}`,
            text: `You have received a new message from your website contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
            // We don't fail the request if email fails, but we log it.
            // Alternatively, could fail request.
        }

        res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
