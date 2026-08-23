import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- USERS ---
app.post('/api/users', async (req, res) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (user) res.json(user);
    else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// --- WORKOUT SESSIONS ---
app.get('/api/users/:userId/workouts', async (req, res) => {
  try {
    const sessions = await prisma.workoutSession.findMany({
      where: { userId: req.params.userId },
      include: {
        exercises: {
          include: { sets: true }
        }
      },
      orderBy: { startedAt: 'desc' }
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

app.post('/api/users/:userId/workouts', async (req, res) => {
  try {
    const { exercises, ...sessionData } = req.body;
    
    const newSession = await prisma.workoutSession.create({
      data: {
        ...sessionData,
        userId: req.params.userId,
        exercises: {
          create: exercises.map((ex: any) => ({
            exerciseId: ex.exerciseId,
            order: ex.order,
            restTimerSeconds: ex.restTimerSeconds,
            sets: {
              create: ex.sets
            }
          }))
        }
      },
      include: {
        exercises: {
          include: { sets: true }
        }
      }
    });
    res.json(newSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

// --- PRS ---
app.get('/api/users/:userId/prs', async (req, res) => {
  try {
    const prs = await prisma.pRRecord.findMany({
      where: { userId: req.params.userId },
      orderBy: { date: 'desc' }
    });
    res.json(prs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PRs' });
  }
});

app.post('/api/users/:userId/prs', async (req, res) => {
  try {
    const pr = await prisma.pRRecord.create({
      data: { ...req.body, userId: req.params.userId }
    });
    res.json(pr);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create PR' });
  }
});

app.listen(PORT, () => {
  console.log(`AZMK Backend running on http://localhost:${PORT}`);
});
