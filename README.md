# PrepWise-AI

An AI-powered Interview Coach Website to help users prepare for job interviews through mock interviews, progress tracking, and intelligent practice recommendations.

## Features

- 🎯 **Mock Interviews**: Practice technical and behavioral interviews with AI-powered feedback
- 📊 **Progress Tracking**: Monitor your improvement with detailed analytics
- 📅 **Calendar Integration**: Sync with Google Calendar to identify upcoming interviews
- 🔐 **Google OAuth**: Secure authentication with Google Sign-In
- 🎨 **Modern UI**: Responsive design with Tailwind CSS
- 🔥 **Firebase Backend**: Real-time database with Firestore

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: Firebase Firestore
- **Deployment**: Vercel
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Google Cloud Project with OAuth 2.0 credentials
- A Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/d7knight2/PrepWise-AI.git
   cd PrepWise-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase and Google OAuth credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Authentication with Google provider
4. Copy your Firebase config to `.env.local`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)
4. Enable Google Calendar API for calendar integration
5. Copy Client ID and Secret to `.env.local`

### NextAuth Secret

Generate a secret for NextAuth:
```bash
openssl rand -base64 32
```

Add it to `.env.local` as `NEXTAUTH_SECRET`

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
PrepWise-AI/
├── components/          # Reusable React components
│   └── Layout.js       # Main layout with navigation
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   │   └── auth/      # NextAuth endpoints
│   ├── _app.js        # App wrapper
│   ├── index.js       # Home/landing page
│   ├── dashboard.js   # User dashboard
│   ├── mock-interview.js  # Mock interview interface
│   └── settings.js    # User settings
├── styles/            # CSS files
│   └── globals.css    # Global styles with Tailwind
├── utils/             # Utility functions
│   └── firebase.js    # Firebase configuration
├── .env.example       # Environment variables template
└── next.config.js     # Next.js configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests with Jest
- `npm run test:watch` - Run unit tests in watch mode
- `npm run test:coverage` - Run unit tests with coverage report
- `npm run test:e2e` - Run UI tests with Playwright
- `npm run test:e2e:headed` - Run UI tests with visible browser
- `npm run test:e2e:debug` - Debug UI tests interactively

## GitHub Workflows

### Automated Testing

This repository includes automated test workflows that run on all pull requests to ensure code quality and functionality.

**Unit Tests:**
- ✅ Runs Jest unit tests for components, pages, and utilities
- ✅ Generates coverage reports
- ✅ Must pass before merging PRs

**UI Tests:**
- ✅ Runs Playwright end-to-end tests
- ✅ Tests UI functionality in Chromium browser
- ✅ Generates HTML reports with screenshots and traces
- ✅ Must pass before merging PRs

**Configuration:** See [Branch Protection Guide](.github/workflows/BRANCH_PROTECTION_GUIDE.md) for instructions on enforcing test requirements.

### Automated Merge Conflict Resolution

This repository includes an automated workflow that runs nightly to detect and resolve merge conflicts in open pull requests.

**Features:**
- 🔄 Automatically merges base branch changes into PRs when possible
- ⚠️ Notifies PR authors when manual resolution is required
- 🔒 Safe - only pushes if merge succeeds without conflicts
- 📊 Detailed logging and error handling
- 🔁 Retry logic for transient failures

**Schedule:** Runs daily at 2:00 AM UTC

**Manual Trigger:** You can manually trigger the workflow from the Actions tab

**Troubleshooting:** See [Merge Conflict Resolution Guide](.github/workflows/MERGE_CONFLICT_TROUBLESHOOTING.md) for detailed documentation on:
- How the workflow operates
- Manual conflict resolution steps
- Common issues and solutions
- Testing procedures
- Timezone information

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

When your PR has merge conflicts, our automated workflow will attempt to resolve them nightly. If automatic resolution isn't possible, you'll receive instructions in your PR.

## License

This project is open source and available under the MIT License.