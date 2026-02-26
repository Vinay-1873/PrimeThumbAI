import Stripe from 'stripe';
import User from '../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const plans = {
    'Basic': {
        priceId: process.env.STRIPE_PRICE_ID_BASIC, 
        credits: 50
    },
    'Pro': {
        priceId: process.env.STRIPE_PRICE_ID_PRO, 
        credits: 1000 // Unlimited usually represented by a high number or handled logically
    }
}

export const createCheckoutSession = async (req, res) => {
    try {
        const { userId } = req.session;
        const { plan } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(userId);

        if (!plans[plan]) {
            return res.status(400).json({ message: 'Invalid plan' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: plans[plan].priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.CLIENT_URL}/my-generation?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/`,
            customer_email: user.email,
            client_reference_id: userId,
            metadata: {
                userId: userId,
                plan: plan
            }
        });

        res.json({ sessionId: session.id, url: session.url });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const { userId } = req.session;

        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Check if the session is paid
        if (session.payment_status === 'paid') {
            const plan = session.metadata.plan;
            
            // Verify this session belongs to the user
            if(session.client_reference_id !== userId) {
                 return res.status(403).json({ success: false, message: "Invalid session user" });
            }

            // Update user (In production, use webhooks to prevent duplicate credits on refresh)
            // For simple test mode validation:
            if (plans[plan]) {
                await User.findByIdAndUpdate(userId, {
                    plan: plan,
                    $inc: { creditBalance: plans[plan].credits },
                    stripeCustomerId: session.customer
                });
            }

            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Payment not completed" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Verification failed" });
    }
}

export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const plan = session.metadata.plan;

        console.log(`Payment successful for user ${userId} plan ${plan}`);

        // Update user
        if (plans[plan]) {
            await User.findByIdAndUpdate(userId, {
                plan: plan,
                $inc: { creditBalance: plans[plan].credits },
                stripeCustomerId: session.customer
            });
        }
    }

    res.json({ received: true });
};
