import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase'; // Import backend Supabase client

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token missing from Authorization header.' });
    }

    try {
        // Verify the token using Supabase auth
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error) {
            console.error("Token verification error:", error.message);
            return res.status(401).json({ message: 'Invalid or expired token.', details: error.message });
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found for this token.' });
        }

        // Attach user object to the request for downstream handlers
        // Use 'any' for now, or define a custom Request type extending Express.Request
        (req as any).user = user;
        (req as any).user.token = token; // Pass token along if needed

        next(); // Proceed to the next middleware or route handler

    } catch (error: any) {
        console.error("Unexpected error in auth middleware:", error);
        return res.status(500).json({ message: 'Internal server error during authentication.' });
    }
}; 