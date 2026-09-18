import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import stringSimilarity from 'string-similarity';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Load canonical exercises data
let canonicalExercises: any[] = [];
try {
  const exercisesPath = path.join(__dirname, 'exercises.json');
  canonicalExercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));
  console.log(`Loaded ${canonicalExercises.length} canonical exercises.`);
} catch (error) {
  console.error("Failed to load canonical exercises:", error);
}

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

// --- EXERCISES (Canonical Mapping) ---
app.get('/api/exercises', (req, res) => {
  const query = req.query.q as string;
  
  if (!query) {
    return res.json({ exercises: canonicalExercises.slice(0, 50) }); // return first 50
  }
  
  if (canonicalExercises.length === 0) {
    return res.status(503).json({ error: 'Exercise dictionary not loaded' });
  }

  // Exact match first
  const exactMatch = canonicalExercises.find(ex => ex.name.toLowerCase() === query.toLowerCase());
  if (exactMatch) {
    return res.json({ match: exactMatch, confidence: 1 });
  }

  // Fuzzy match using string-similarity
  const names = canonicalExercises.map(ex => ex.name);
  const match = stringSimilarity.findBestMatch(query, names);
  
  const bestMatchIndex = match.bestMatchIndex;
  const bestMatchRating = match.bestMatch.rating;
  const matchedExercise = canonicalExercises[bestMatchIndex];

  res.json({
    match: matchedExercise,
    confidence: bestMatchRating
  });
});

app.listen(PORT, () => {
  console.log(`AZMK Backend running on http://localhost:${PORT}`);
});
