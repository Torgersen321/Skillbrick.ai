import express, { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase'; // Assuming shared Supabase client instance
import { authenticate } from '../middleware/authMiddleware'; // Assuming auth middleware exists

const router: Router = express.Router();

// --- GET /api/profile ---
// Get the profile of the currently authenticated user
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    // req.user should be populated by the authenticate middleware
    const userId = (req as any).user?.id; 

    if (!userId) {
        // This shouldn't happen if authenticate middleware works correctly
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
        // Fetch profile data from your 'profiles' table (or whichever table holds public profile info)
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*') // Select specific fields: 'username, avatar_url, bio, etc.'
            .eq('id', userId)
            .single(); // Use single() as profile id should be unique

        if (error) {
            console.error("Error fetching profile:", error);
            // Handle cases like profile not found if it's possible user exists in auth but not profiles table
            if (error.code === 'PGRST116') { // PostgREST error code for no rows found with single()
                 return res.status(404).json({ message: 'Profile not found.' });
            }
            return next(error); // Pass other errors to error handling middleware
        }

        if (!profile) {
             return res.status(404).json({ message: 'Profile not found.' });
        }

        // Optionally fetch email from auth.users if needed and not in profiles
        // const { data: authUser, error: authError } = await supabase.auth.getUser(req.user.token); // Need token from middleware

        res.json(profile);

    } catch (error) {
        next(error); // Pass unexpected errors to middleware
    }
});

// --- PUT /api/profile ---
// Update the profile of the currently authenticated user
router.put('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const { username, avatar_url, bio /* other updatable fields */ } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Basic validation (add more robust validation, e.g., using express-validator)
    if (typeof username !== 'undefined' && (typeof username !== 'string' || username.length < 3)) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
    }
    // Add validation for other fields (avatar_url format, bio length, etc.)

    const updates: { [key: string]: any } = {};
    if (typeof username !== 'undefined') updates.username = username;
    if (typeof avatar_url !== 'undefined') updates.avatar_url = avatar_url;
    if (typeof bio !== 'undefined') updates.bio = bio;
    // Add other fields to updates object

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No update fields provided.' });
    }

    updates.updated_at = new Date(); // Update timestamp

    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select() // Select updated data to return
            .single();

        if (error) {
            console.error("Error updating profile:", error);
            // Handle potential errors like unique constraint violation (e.g., username already taken)
            if (error.code === '23505') { // Postgres unique violation code
                 return res.status(409).json({ message: 'Username already taken.' });
            }
            return next(error);
        }

        res.json(data);

    } catch (error) {
        next(error);
    }
});

// --- DELETE /api/profile ---
// Placeholder: Account deletion requires careful consideration (soft vs hard delete, data cleanup)
// router.delete('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
//     const userId = (req as any).user?.id;
//     // 1. Verify user identity (e.g., require password confirmation)
//     // 2. Implement soft delete (set is_active = false) or hard delete
//     // 3. Handle cascade deletes or anonymization of related data
//     // 4. Sign the user out
//     res.status(501).json({ message: 'Account deletion not implemented yet.' });
// });

export default router; 