import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

import propertyRoutes from './routes/properties';
import searchRoutes   from './routes/search';
import agentRoutes    from './routes/agents';
import authRoutes     from './routes/auth';
import userRoutes     from './routes/users';
import { notFound, errorHandler } from './middleware/errorHandler';

dotenv.config();

const app  = express();
const PORT = process.env.PORT ?? 5000;

// ── Global middleware ─────────────────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/search',     searchRoutes);
app.use('/api/agents',     agentRoutes);
app.use('/api/users',      userRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Estatero API running on http://localhost:${PORT}`);
});

export default app;
