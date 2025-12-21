import { Router } from 'express';
import userRoutes from './users.routes';
import campaignRoutes from './campaigns.routes';
import paymentRoutes from './payments.routes';
import integrationRoutes from './integrations.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/payments', paymentRoutes);
router.use('/integrations', integrationRoutes);

export default router;
