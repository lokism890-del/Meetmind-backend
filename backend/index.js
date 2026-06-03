import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import meetingsRouter from './src/routes/meetings.js';
import calendarRouter from './src/routes/calendar.js';
import processRouter from './src/routes/process.js';
import { startReminderScheduler } from './src/services/reminderService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'https://meetmind-two.vercel.app',
    'https://meetmind-jfquq8x1k-lokism890-dels-projects.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MeetMind API is running' });
});

app.use('/api/meetings', meetingsRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/process', processRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log('✅ MeetMind API running on port ' + PORT);
  startReminderScheduler();
});
