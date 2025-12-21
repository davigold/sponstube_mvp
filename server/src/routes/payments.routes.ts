import { Router } from 'express';
import { createCheckoutSession } from '../services/stripe.service';

const router = Router();

router.post('/checkout', async (req, res) => {
    try {
        const { amount, currency } = req.body;
        const session = await createCheckoutSession(amount, currency);
        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ error: 'Payment initialization failed' });
    }
});

export default router;
