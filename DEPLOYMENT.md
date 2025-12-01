# GSD - Deployment Guide

This guide will walk you through deploying the GSD application to production.

## Architecture Overview

- **Client (Frontend)**: React + Vite → Deployed to **Vercel** (Free)
- **Server (Backend)**: Express + Prisma → Deployed to **Railway** (~$5/month)
- **Database**: PostgreSQL (included with Railway)

## Prerequisites

Before starting, make sure you have:
1. GitHub account (for code repository)
2. Vercel account (sign up at vercel.com with GitHub)
3. Railway account (sign up at railway.app with GitHub)
4. Google Cloud Console account (for OAuth)
5. Gmail account (for sending verification emails)

---

## Part 1: Prepare Your Code

### 1.1 Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Save this secret - you'll need it later for environment variables.

### 1.2 Set Up Google OAuth for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your existing project (or the one you created for local development)
3. Go to **APIs & Services** → **Credentials**
4. Click on your existing **OAuth 2.0 Client ID**
5. Add production URLs to **Authorized redirect URIs**:
   - You'll add the Railway URL later (format: `https://your-app.up.railway.app/api/auth/google/callback`)
   - Keep the local redirect URI: `http://localhost:8787/api/auth/google/callback`

**Note**: You'll come back here after deploying to Railway to add the production callback URL.

### 1.3 Set Up Gmail App Password

To send verification emails in production:

1. Go to your [Google Account](https://myaccount.google.com/)
2. Go to **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Go to **App Passwords**
5. Create a new app password:
   - App: "Mail"
   - Device: "Other" (enter "GSD Production")
6. Copy the 16-character password (you'll use this as `SMTP_PASS`)

---

## Part 2: Deploy Server to Railway

### 2.1 Push Your Code to GitHub

1. Make sure all your changes are committed:
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin master
```

### 2.2 Create New Project on Railway

1. Go to [Railway](https://railway.app/)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `gsd` repository
5. Railway will detect your monorepo structure

### 2.3 Configure Railway Service

1. After Railway creates the project, click on the service
2. Go to **Settings**:
   - **Root Directory**: `packages/server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 2.4 Add PostgreSQL Database

1. In your Railway project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway will automatically create a PostgreSQL database
3. The database will get a `DATABASE_URL` environment variable

### 2.5 Configure Environment Variables

1. Click on your server service
2. Go to **Variables** tab
3. Add the following variables:

```env
NODE_ENV=production
PORT=8787
DATABASE_URL=${{Postgres.DATABASE_URL}}
CLIENT_URL=https://your-app.vercel.app
JWT_SECRET=<your-generated-secret-from-1.1>
GOOGLE_CLIENT_ID=<from-google-cloud-console>
GOOGLE_CLIENT_SECRET=<from-google-cloud-console>
GOOGLE_CALLBACK_URL=https://your-app.up.railway.app/api/auth/google/callback
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-gmail-address>
SMTP_PASS=<app-password-from-1.3>
FROM_EMAIL=<your-gmail-address>
FROM_NAME=GSD App
```

**Important Notes**:
- Replace `<your-generated-secret-from-1.1>` with the JWT secret you generated
- Replace `<from-google-cloud-console>` with your Google OAuth credentials
- Replace `<your-gmail-address>` with your Gmail address
- Replace `<app-password-from-1.3>` with the Gmail app password
- The `DATABASE_URL` uses Railway's variable reference syntax (`${{Postgres.DATABASE_URL}}`)
- You'll update `CLIENT_URL` after deploying to Vercel
- **CRITICAL**: Replace `https://your-app.up.railway.app` with your ACTUAL Railway URL (see step 2.6)

### 2.6 Deploy and Get Railway URL

1. Railway will automatically deploy your server
2. Once deployed, go to **Settings** → **Networking**
3. Click **"Generate Domain"** to get a public URL (e.g., `gsd-production-xxxx.up.railway.app`)
4. Copy this URL - you'll need it for:
   - Updating `GOOGLE_CALLBACK_URL` environment variable
   - Adding to Google OAuth redirect URIs
   - Configuring the client

### 2.7 Update Google OAuth Configuration (CRITICAL FOR OAUTH TO WORK)

⚠️ **This step is REQUIRED for Google Sign-In to work!**

#### A. Update Railway Environment Variable

1. In Railway, go to your server service
2. Go to **Variables** tab
3. Find the `GOOGLE_CALLBACK_URL` variable
4. Update it to: `https://[YOUR-ACTUAL-RAILWAY-URL]/api/auth/google/callback`
   - Example: `https://gsd-production-xxxx.up.railway.app/api/auth/google/callback`
5. Railway will automatically redeploy with the new URL

#### B. Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services** → **Credentials**
3. Click on your **OAuth 2.0 Client ID** (the one you created in step 1.2)
4. In the **Authorized redirect URIs** section, click **+ ADD URI**
5. Add: `https://[YOUR-ACTUAL-RAILWAY-URL]/api/auth/google/callback`
   - Example: `https://gsd-production-xxxx.up.railway.app/api/auth/google/callback`
6. Click **Save**
7. Wait a few minutes for Google's changes to propagate

#### C. Test Google OAuth

1. Go to your deployed client app
2. Click "Sign in with Google"
3. You should now be redirected to Google's login page successfully
4. After authenticating, you'll be redirected back to your app

### 2.8 Run Database Migration

1. In Railway, go to your server service
2. Go to **Deployments** tab
3. Click on the latest deployment
4. Open **View Logs**
5. Verify the server started successfully

Railway will automatically run migrations when the server starts (if you configured the build/start commands correctly).

---

## Part 3: Deploy Client to Vercel

### 3.1 Create New Project on Vercel

1. Go to [Vercel](https://vercel.com/)
2. Click **"Add New..."** → **"Project"**
3. Import your `gsd` repository from GitHub
4. Vercel will detect your monorepo

### 3.2 Configure Vercel Project

1. **Framework Preset**: Vite
2. **Root Directory**: `packages/client`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### 3.3 Add Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add the following variable:

```env
VITE_API_BASE_URL=https://your-app.up.railway.app/api
```

Replace `your-app.up.railway.app` with your actual Railway domain.

### 3.4 Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your client
3. Once deployed, you'll get a URL like: `https://your-app.vercel.app`
4. Copy this URL

### 3.5 Update Railway Environment Variables

1. Go back to Railway
2. Update the `CLIENT_URL` environment variable:
   ```env
   CLIENT_URL=https://your-app.vercel.app
   ```
3. Replace with your actual Vercel domain
4. Save - Railway will automatically redeploy

---

## Part 4: Verify Deployment

### 4.1 Test Health Check

Visit: `https://your-app.up.railway.app/health`

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "environment": "production"
}
```

### 4.2 Test Client

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try to sign up with email:
   - Enter email and password
   - Submit form
   - You should receive a verification email
   - Click the verification link
   - You should be redirected and logged in
3. Try to sign up with Google:
   - Click "Sign up with Google"
   - Complete OAuth flow
   - You should be logged in

### 4.3 Test API Endpoints

```bash
# Test health check
curl https://your-app.up.railway.app/health

# Test CORS (should work from your Vercel domain)
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-app.up.railway.app/api/auth/register
```

---

## Part 5: Ongoing Maintenance

### 5.1 Monitor Your Deployments

**Railway**:
- Check logs: Railway Dashboard → Your Service → Deployments → View Logs
- Monitor database: Railway Dashboard → PostgreSQL → Metrics
- Check costs: Railway Dashboard → Usage

**Vercel**:
- Check deployments: Vercel Dashboard → Your Project → Deployments
- Monitor performance: Vercel Dashboard → Analytics
- Check costs: Vercel Dashboard → Usage (free tier is generous)

### 5.2 Deploy Updates

**For server changes**:
1. Make changes locally
2. Test locally
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your change description"
   git push origin master
   ```
4. Railway will automatically deploy the new version

**For client changes**:
1. Make changes locally
2. Test locally
3. Commit and push to GitHub
4. Vercel will automatically deploy the new version

### 5.3 Database Migrations

When you make changes to the Prisma schema:

1. **Locally**:
   ```bash
   cd packages/server
   npx prisma migrate dev --name describe_your_change
   ```

2. **Commit and push** the migration files

3. **Railway** will automatically run migrations on deploy (using `npm run build` which runs `prisma generate`)

---

## Troubleshooting

### Server won't start on Railway

1. Check Railway logs for errors
2. Verify all environment variables are set correctly
3. Ensure `DATABASE_URL` is connected to PostgreSQL
4. Verify build/start commands are correct

### Client can't connect to server

1. Check `VITE_API_BASE_URL` in Vercel environment variables
2. Verify Railway server is running (check health endpoint)
3. Check CORS configuration in Railway's `CLIENT_URL` variable
4. Open browser console to see specific error messages

### Google OAuth not working

1. Verify redirect URIs in Google Cloud Console match exactly:
   - Local: `http://localhost:8787/api/auth/google/callback`
   - Production: `https://your-app.up.railway.app/api/auth/google/callback`
2. Check `GOOGLE_CALLBACK_URL` in Railway environment variables
3. Ensure `CLIENT_URL` in Railway matches your Vercel domain

### Email verification not working

1. Verify Gmail app password is correct
2. Check SMTP configuration in Railway environment variables
3. Check Railway logs for email sending errors
4. Verify 2-Step Verification is enabled on your Google account

### Database connection errors

1. Verify `DATABASE_URL` is set correctly in Railway
2. Check PostgreSQL database is running in Railway
3. Ensure migrations ran successfully (check Railway logs)

---

## Security Checklist

- [x] JWT_SECRET is strong (64+ characters) and unique
- [x] Environment variables are set in Railway/Vercel (not in code)
- [x] CORS is configured to only allow your Vercel domain
- [x] Rate limiting is enabled (100 requests per 15 minutes)
- [x] Helmet is enabled for security headers
- [x] Google OAuth redirect URIs are exact matches
- [x] Gmail app password is used (not regular password)
- [x] Database is PostgreSQL (not SQLite) in production
- [x] Health check endpoint is working
- [x] Email verification is enabled

---

## Cost Breakdown

- **Vercel (Client)**: Free
- **Railway (Server + Database)**: ~$5/month
  - First $5 of usage is free each month
  - After that, pay-as-you-go
  - PostgreSQL database included
- **Total**: ~$0-5/month (depends on usage)

---

## Next Steps

After deployment:
1. Set up custom domain (optional)
2. Configure monitoring/alerting
3. Set up automatic backups for database
4. Add analytics (Vercel Analytics, Google Analytics)
5. Set up error tracking (Sentry, LogRocket)

---

## Support

If you run into issues:
1. Check Railway logs
2. Check Vercel deployment logs
3. Check browser console
4. Verify all environment variables
5. Ensure all secrets are correct

Good luck with your deployment! 🚀
