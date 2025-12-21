import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { brandProfile: true, communities: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            include: { brandProfile: true, communities: true }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create User (Auth Mock)
router.post('/', async (req, res) => {
    try {
        const { name, email, role, avatarUrl } = req.body;
        const user = await prisma.user.create({
            data: { name, email, role, avatarUrl }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

export default router;
