# PrepWise AI Setup Guide

This guide will help you set up the PrepWise AI Interview Coach Website from scratch.

## Prerequisites

Before you begin, ensure you have:
- Node.js 16+ and npm installed
- A Google Cloud Project
- A Firebase project
- Git installed on your machine

## Step 1: Clone and Install

```bash
git clone https://github.com/d7knight2/PrepWise-AI.git
cd PrepWise-AI
npm install
```

## Step 2: Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the wizard
   - Choose a project name (e.g., "prepwise-ai")

2. **Enable Firestore Database**
   - In Firebase Console, navigate to "Build" > "Firestore Database"
   - Click "Create database"
   - Start in production mode (or test mode for development)
   - Choose a location close to your users

3. **Enable Authentication**
   - Navigate to "Build" > "Authentication"
   - Click "Get started"
   - Click on "Google" under Sign-in providers
   - Enable the Google provider
   - Add your support email
   - Save

4. **Get Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Register your app
   - Copy the firebaseConfig object values

## Step 3: Google Cloud Setup

1. **Create OAuth 2.0 Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project (or create a new one)
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Configure the consent screen if prompted
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-domain.vercel.app/api/auth/callback/google` (for production)
   - Copy the Client ID and Client Secret

2. **Enable Google Calendar API**
   - In Google Cloud Console, go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and enable it

## Step 4: Environment Configuration

1. **Create .env.local file**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in the environment variables**
   
   Open `.env.local` and replace the placeholder values:
   
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate_this_with_openssl_command
   
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. **Generate NextAuth Secret**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as your `NEXTAUTH_SECRET`

## Step 5: Run the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   - Navigate to `http://localhost:3000`
   - You should see the landing page

3. **Test authentication**
   - Click "Get Started with Google"
   - Sign in with your Google account
   - You should be redirected to the dashboard

## Step 6: Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   - In Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add all variables from your `.env.local` file
   - **Important**: Update `NEXTAUTH_URL` to your production URL
   - Add your production callback URL to Google Cloud Console

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app is live!

## Firestore Database Structure

The application uses the following Firestore collections:

```
users/
  {userId}/
    - email: string
    - name: string
    - createdAt: timestamp
    - targetRole: string (optional)
    - experience: string (optional)

interviews/
  {interviewId}/
    - userId: string
    - type: "technical" | "behavioral"
    - difficulty: "easy" | "medium" | "hard"
    - score: number
    - feedback: string
    - createdAt: timestamp
    - duration: number

calendar_events/
  {eventId}/
    - userId: string
    - title: string
    - company: string
    - position: string
    - startTime: timestamp
    - synced: boolean
```

## Firebase Security Rules

Add these security rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own interviews
    match /interviews/{interviewId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Users can only access their own calendar events
    match /calendar_events/{eventId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## Troubleshooting

### Build Errors

- **Tailwind CSS errors**: Ensure you're using Tailwind CSS v3.x
- **Firebase errors**: Double-check your environment variables
- **NextAuth errors**: Verify your OAuth credentials and callback URLs

### Authentication Issues

- **Redirect loop**: Check your `NEXTAUTH_URL` matches your actual URL
- **OAuth error**: Verify callback URLs in Google Cloud Console
- **Calendar not syncing**: Ensure Google Calendar API is enabled

### Development Tips

- Use the browser console to debug authentication issues
- Check Network tab for API call failures
- Review Firebase Console for database write errors

## Next Steps

After setting up the foundation:

1. **Implement AI Integration**
   - Add OpenAI API for interview feedback
   - Implement speech-to-text for voice interviews

2. **Calendar Sync Logic**
   - Build API route to fetch Google Calendar events
   - Parse interview-related events
   - Store in Firestore

3. **Mock Interview Features**
   - Build question database
   - Implement real-time feedback system
   - Add scoring algorithm

4. **Data Sources**
   - Integrate Glassdoor API (if available)
   - Reddit API for company insights
   - Build web scraper for interview questions

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/d7knight2/PrepWise-AI/issues)
- Review the [Next.js Documentation](https://nextjs.org/docs)
- Check [Firebase Documentation](https://firebase.google.com/docs)
- Review [NextAuth Documentation](https://next-auth.js.org/)
