import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import profileRoutes from './routes/profileRoutes';
// Import other routes as needed

const app = express();
const port = process.env.PORT || 3001; // Default backend port

// --- Middleware ---
// Enable CORS for all origins (adjust in production!)
app.use(cors()); 
// Parse JSON request bodies
app.use(express.json()); 

// --- Routes ---
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'SkillBrick Backend API is running!' }); // Simple API root response
});

// Mount profile routes under /api/profile
app.use('/api/profile', profileRoutes); 

// Mount other routes here
// app.use('/api/learning-paths', learningPathRoutes);

// --- Basic Error Handling ---
// Catch-all for unhandled routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

// Generic error handler (catches errors passed via next(err))
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[Global Error Handler]:", err.stack || err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ message });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
