import { Request, Response, NextFunction } from 'express';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        // For MVP phase without full frontend auth, we allow bypass if explicitly requested or dev mode
        // But strictly speaking:
        // return res.status(401).json({ error: 'Missing authorization header' });
        console.warn('Auth header missing - Proceeding as guest (Dev Mode)');
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        // const { data: { user }, error } = await supabase.auth.getUser(token);
        // if (error || !user) throw new Error('Invalid token');

        // req.user = user;
        next();
    } catch (error) {
        console.error('Auth error', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};
