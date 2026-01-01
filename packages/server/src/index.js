// server/src/index.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import passport from "./config/passport.js";
import path from "path";
import { fileURLToPath } from "url";

import { ENV } from "./config/env.js";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { validateEnv } from "./config/validateEnv.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment variables before starting the server
validateEnv();

const app = express();

// Trust proxy - required for Railway/Vercel deployment
app.set('trust proxy', 1);

// CORS MUST be first - before helmet and rate limiter
// This ensures preflight requests (OPTIONS) get proper CORS headers
app.use(cors({
    origin: ENV.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600, // Cache preflight for 10 minutes
}));

// Security: Helmet adds various HTTP headers for security
// Configure to allow CORS and serve uploaded files
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "blob:", "*"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        }
    }
}));

// Security: Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Allow 1000 requests per 15 minutes
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => req.method === 'OPTIONS', // Don't rate limit preflight requests
});

// Apply rate limiting to API routes
app.use('/api', limiter);

app.use(express.json());

// Initialize Passport for OAuth
app.use(passport.initialize());

// Health check endpoint (useful for monitoring and Railway deployment)
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: ENV.NODE_ENV,
    });
});

// Serve uploaded files
const uploadsPath = path.join(__dirname, "../../uploads");
app.use("/uploads", express.static(uploadsPath));

// Serve side-project static files (production only - in dev, Vite serves it)
const sideProjectPath = path.join(__dirname, '../../side-project/dist');
app.use('/side-project', express.static(sideProjectPath));

// SPA fallback for side-project (must be before API routes to avoid conflicts)
app.get('/side-project/*', (req, res) => {
  res.sendFile(path.join(sideProjectPath, 'index.html'));
});

// API routes
app.use("/api", router);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(ENV.PORT, () => {
    console.log(`✅ Server is running on http://localhost:${ENV.PORT}`);
    console.log(`   Environment: ${ENV.NODE_ENV}`);
    console.log(`   Client URL: ${ENV.CLIENT_URL}`);
});




