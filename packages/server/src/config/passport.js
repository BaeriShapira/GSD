import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateGoogleUser } from "../services/authService.js";

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    console.warn(
        "⚠️  Google OAuth credentials not found in environment variables. Google login will not work."
    );
}

// Configure Google OAuth Strategy for login/signup
passport.use('google-login',
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID || "dummy",
            clientSecret: GOOGLE_CLIENT_SECRET || "dummy",
            callbackURL: GOOGLE_CALLBACK_URL || "http://localhost:8787/api/auth/google/callback",
            scope: [
                'openid',
                'profile',
                'email',
                'https://www.googleapis.com/auth/calendar.events.owned'  // Request calendar access (owned events only)
            ],
            accessType: 'offline',  // Request refresh token
            prompt: 'consent'       // Force consent screen to get refresh token
        },
        async (accessToken, refreshToken, params, profile, done) => {
            try {
                // Calculate token expiry time
                const expiryDate = params.expiry_date
                    ? new Date(params.expiry_date)
                    : new Date(Date.now() + (params.expires_in || 3600) * 1000);

                // Extract user info from Google profile
                const googleProfile = {
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    displayName: profile.displayName,
                    avatarUrl: profile.photos[0]?.value,
                    accessToken,
                    refreshToken,
                    expiryDate,
                };

                // Find or create user in database (this will save encrypted tokens)
                const user = await findOrCreateGoogleUser(googleProfile);

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Configure Google OAuth Strategy for calendar connection (existing users)
passport.use('google-calendar',
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID || "dummy",
            clientSecret: GOOGLE_CLIENT_SECRET || "dummy",
            callbackURL: (GOOGLE_CALLBACK_URL || "http://localhost:8787/api/auth/google/callback").replace('/callback', '/calendar/callback'),
            scope: [
                'openid',
                'profile',
                'email',
                'https://www.googleapis.com/auth/calendar.events.owned'  // Request calendar access (owned events only)
            ],
            accessType: 'offline',  // Request refresh token
            prompt: 'consent'       // Force consent screen to get refresh token
        },
        async (accessToken, refreshToken, params, profile, done) => {
            try {
                // Calculate token expiry time
                const expiryDate = params.expiry_date
                    ? new Date(params.expiry_date)
                    : new Date(Date.now() + (params.expires_in || 3600) * 1000);

                // Extract user info from Google profile
                const googleProfile = {
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    displayName: profile.displayName,
                    avatarUrl: profile.photos[0]?.value,
                    accessToken,
                    refreshToken,
                    expiryDate,
                };

                // Find or create user in database (this will save encrypted tokens)
                const user = await findOrCreateGoogleUser(googleProfile);

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize user for session (not used with JWT, but required by Passport)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session (not used with JWT, but required by Passport)
passport.deserializeUser((id, done) => {
    // We won't actually use this since we're using JWT tokens
    done(null, { id });
});

export default passport;
