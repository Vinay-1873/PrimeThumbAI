import express from "express";
import { addTestimonial, getTestimonials } from "../controller/TestimonialController.js";
import protect from "../middlewares/auth.js";

const TestimonialRouter = express.Router();

TestimonialRouter.post("/add", protect, addTestimonial);
TestimonialRouter.get("/all", getTestimonials);

export default TestimonialRouter;
