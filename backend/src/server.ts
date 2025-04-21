import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3001; // Default backend port

app.get('/', (req: Request, res: Response) => {
  res.send('SkillBrick Backend says Hello!');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
