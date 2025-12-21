import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'mock_key', {
    apiVersion: '2025-01-27.acacia',
});

export const createCheckoutSession = async (amount: number, currency: string = 'brl') => {
    if (!process.env.STRIPE_SECRET_KEY) {
        console.warn('Stripe key missing, returning mock session');
        return { id: 'mock_session_' + Date.now(), url: 'http://localhost:3000/success' };
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: 'Campanha Sponstube (Escrow)',
                        },
                        unit_amount: amount * 100, // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel`,
        });
        return session;
    } catch (error) {
        console.error('Stripe error:', error);
        throw error;
    }
};
