import express from 'express';
import { createCheckoutSession, stripeWebhook, verifyPayment } from '../controller/PaymentController.js';
import protect from '../middlewares/auth.js';

const PaymentRouter = express.Router();

PaymentRouter.post('/create-checkout-session', protect, createCheckoutSession);
PaymentRouter.post('/verify-session', protect, verifyPayment);

// Webhook route defined in server.js to handle raw body, or here if we handle middleware carefully
// But usually webhooks are best mounted at root or explicitly handled with express.raw
// I will not add webhook here to avoid conflicts with global express.json()

export default PaymentRouter;
