# Google OAuth Setup Guide

## Overview
This guide will walk you through setting up Google OAuth authentication for your GSD application.

## Prerequisites
- A Google account
- Your application running locally (or deployed)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "GSD App")
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, select your project
2. Go to "APIs & Services" → "Library"
3. Search for "Google+ API"
4. Click on it and press "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" (unless you have a Google Workspace)
   - Fill in the required fields:
     - App name: GSD App
     - User support email: your email
     - Developer contact email: your email
   - Click "Save and Continue"
   - Skip "Scopes" for now
   - Add test users (your email) if in testing mode
   - Click "Save and Continue"

4. Back to "Create OAuth client ID":
   - Application type: **Web application**
   - Name: GSD Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Add your production URL when deployed
   - Authorized redirect URIs:
     - `http://localhost:8787/api/auth/google/callback` (for development)
     - Add your production callback URL when deployed
   - Click "Create"

5. Copy your **Client ID** and **Client Secret**

## Step 4: Update Environment Variables

1. Open `packages/server/.env`
2. Update the following variables with your credentials:

```env
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:8787/api/auth/google/callback
CLIENT_URL=http://localhost:5173
```

## Step 5: Test the Integration

1. Start your server:
   ```bash
   cd packages/server
   npm run dev
   ```

2. Start your client:
   ```bash
   cd packages/client
   npm run dev
   ```

3. Navigate to `http://localhost:5173/login`
4. Click "התחבר עם Google" (Sign in with Google)
5. You should be redirected to Google's OAuth consent screen
6. Grant permissions
7. You should be redirected back to your app and logged in!

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure your redirect URI in Google Cloud Console **exactly matches** the one in your `.env` file
- Check for trailing slashes, http vs https, etc.

### Error: "Access blocked: This app's request is invalid"
- Make sure you've added yourself as a test user in the OAuth consent screen
- Check that all required scopes are configured

### OAuth flow works but user not created
- Check server logs for errors
- Verify database connection
- Ensure Prisma migration was run successfully

### User sees "An account with this email already exists"
- This means a user with the same email already registered with email/password
- You can either:
  1. Use a different email for Google OAuth
  2. Implement account linking (advanced feature)

## Production Deployment

When deploying to production:

1. Update OAuth consent screen to "Production" status
2. Add production URLs to authorized origins and redirect URIs:
   - Origin: `https://yourdomain.com`
   - Redirect URI: `https://yourdomain.com/api/auth/google/callback`
3. Update `.env` variables with production URLs
4. Consider using environment-specific configuration

## Security Notes

- **Never commit** your `.env` file with real credentials to version control
- Keep your `GOOGLE_CLIENT_SECRET` secure
- Use HTTPS in production
- Regularly rotate secrets
- Monitor OAuth activity in Google Cloud Console

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
