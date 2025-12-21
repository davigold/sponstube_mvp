import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all campaigns
router.get('/', async (req, res) => {
    try {
        const campaigns = await prisma.campaign.findMany({
            include: { brand: true }
        });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
});

// Create Campaign
router.post('/', async (req, res) => {
    try {
        const { name, brandId, brief, budgetTotal, templatesUsedIds } = req.body;
        const campaign = await prisma.campaign.create({
            data: {
                name,
                brandId,
                brief,
                budgetTotal,
                status: 'applied',
                // Note: templatesUsedIds not currently mapped in simple schema, would need a relation table or Json field
            }
        });
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create campaign' });
    }
});

export default router;
