// server/src/index.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import passport from "./config/passport.js";

import { ENV } from "./config/env.js";
import router from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { validateEnv } from "./config/validateEnv.js";

// Validate environment variables before starting the server
validateEnv();

const app = express();

// Security: Helmet adds various HTTP headers for security
app.use(helmet());

// Security: Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to API routes
app.use('/api', limiter);

// CORS configuration - only allow requests from the client URL
app.use(cors({
    origin: ENV.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

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
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api", router);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(ENV.PORT, () => {
    console.log(`✅ Server is running on http://localhost:${ENV.PORT}`);
    console.log(`   Environment: ${ENV.NODE_ENV}`);
    console.log(`   Client URL: ${ENV.CLIENT_URL}`);
});

