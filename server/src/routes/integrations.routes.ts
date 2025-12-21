import { Router } from 'express';
import { getChannelStats } from '../services/youtube.service';
import { analyzeMatch } from '../services/ai.service';

const router = Router();

// YouTube Stats
router.get('/youtube/:channelId', async (req, res) => {
    try {
        const stats = await getChannelStats(req.params.channelId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch TV channel stats' });
    }
});

// AI Match Analysis
router.post('/ai/match', async (req, res) => {
    try {
        const { brandData, creatorData } = req.body;
        const analysis = await analyzeMatch(brandData, creatorData);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: 'AI Analysis failed' });
    }
});

export default router;
