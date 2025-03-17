import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { json } from 'body-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from 'dotenv';

config();

const prisma = new PrismaClient();
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(json());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Connect to database and start server
const PORT = process.env.PORT || 3000;

prisma.$connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
