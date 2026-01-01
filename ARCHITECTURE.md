# PrepWise AI Architecture

This document describes the architecture and technical decisions for the PrepWise AI Interview Coach Website.

## Technology Stack

### Frontend
- **Next.js 14**: React framework with SSR/SSG capabilities
- **React 18**: UI library with hooks and modern patterns
- **Tailwind CSS 3**: Utility-first CSS framework for rapid UI development
- **Heroicons**: Beautiful hand-crafted SVG icons

### Backend & Services
- **NextAuth.js**: Authentication library for Next.js
- **Firebase Firestore**: NoSQL cloud database
- **Firebase Authentication**: Authentication service
- **Google OAuth 2.0**: Identity provider
- **Google Calendar API**: Calendar integration

### Deployment
- **Vercel**: Hosting and deployment platform with CI/CD

## Project Structure

```
PrepWise-AI/
├── components/          # Reusable React components
│   └── Layout.js       # Main application layout with navigation
├── pages/              # Next.js pages (file-based routing)
│   ├── api/           # API routes
│   │   └── auth/      # NextAuth authentication endpoints
│   ├── _app.js        # Custom App component
│   ├── index.js       # Landing/home page
│   ├── dashboard.js   # User dashboard
│   ├── mock-interview.js  # Mock interview interface
│   └── settings.js    # User settings page
├── styles/            # Global styles
│   └── globals.css    # Tailwind directives and custom styles
├── utils/             # Utility functions and configurations
│   └── firebase.js    # Firebase initialization and config
├── public/            # Static assets (images, fonts, etc.)
├── .env.local         # Environment variables (not in git)
├── .env.example       # Environment variables template
├── next.config.js     # Next.js configuration
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js  # PostCSS configuration
└── jsconfig.json      # JavaScript configuration for path aliases
```

## Key Features & Implementation

### 1. Authentication Flow

**Technology**: NextAuth.js with Google Provider

**Flow**:
1. User clicks "Sign in with Google" on landing page
2. NextAuth redirects to Google OAuth consent screen
3. User grants permissions (profile, email, calendar)
4. Google redirects back with authorization code
5. NextAuth exchanges code for access/refresh tokens
6. Session is created and stored
7. User is redirected to dashboard

**Implementation**:
- `/pages/api/auth/[...nextauth].js` - NextAuth configuration
- Scopes requested: `openid`, `email`, `profile`, `calendar.readonly`
- Tokens stored in session for API calls

### 2. Database Schema (Firestore)

**Collections**:

**users/**
- Stores user profile information
- Created on first login
- Fields: email, name, image, targetRole, experience, settings

**interviews/**
- Stores mock interview sessions and results
- Fields: userId, type, difficulty, questions, answers, score, feedback, timestamp

**calendar_events/**
- Synced calendar events identified as interviews
- Fields: userId, eventId, title, company, position, startTime, notified

**progress/**
- User progress tracking over time
- Fields: userId, date, interviewsCompleted, averageScore, topicsImproved

### 3. Page Routing & Protection

**Public Routes**:
- `/` - Landing page with features and CTA

**Protected Routes** (require authentication):
- `/dashboard` - Overview, stats, upcoming interviews
- `/mock-interview` - Start and conduct mock interviews
- `/settings` - User preferences and data management

**Protection Implementation**:
- Each protected page uses `useSession()` hook
- Checks authentication status
- Redirects to `/` if not authenticated
- Shows loading spinner during check

### 4. UI/UX Design

**Design Principles**:
- Mobile-first responsive design
- Clean, modern interface with gradient accents
- Consistent color scheme (primary: purple-blue gradient)
- Clear visual hierarchy
- Accessible components

**Components**:
- **Layout**: Navigation bar, footer, consistent spacing
- **Cards**: Reusable card component with hover effects
- **Buttons**: Primary and secondary button styles
- **Forms**: Styled inputs with focus states

### 5. State Management

**Approach**: React hooks and context

**Session State**:
- Managed by NextAuth's `SessionProvider`
- Available via `useSession()` hook throughout app

**Local State**:
- React `useState` for component-specific state
- Form inputs, UI toggles, temporary data

**Server State** (future):
- React Query or SWR for data fetching
- Cache management for Firestore queries

## API Routes

### Authentication
- `POST /api/auth/signin` - Initiate Google OAuth
- `POST /api/auth/signout` - End user session
- `GET /api/auth/session` - Get current session

### Future API Routes (to be implemented)

**Calendar Sync**:
- `GET /api/calendar/events` - Fetch upcoming events
- `POST /api/calendar/sync` - Trigger calendar sync

**Interviews**:
- `POST /api/interviews/start` - Start new mock interview
- `POST /api/interviews/{id}/submit` - Submit interview answers
- `GET /api/interviews/{id}/feedback` - Get AI feedback

**User Data**:
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/stats` - Get user statistics

## Security Considerations

### Environment Variables
- All sensitive keys stored in `.env.local`
- Never committed to version control
- Separate values for development/production

### Firestore Security Rules
- User data isolated by user ID
- Read/write only allowed for own data
- Authenticated users only

### Authentication
- OAuth 2.0 industry standard
- HTTPS enforced in production
- Secure session management via NextAuth

### API Security
- CSRF protection via NextAuth
- Rate limiting (to be implemented)
- Input validation on all endpoints

## Performance Optimizations

### Next.js Features
- **Static Generation**: Landing page pre-rendered
- **Server-Side Rendering**: Protected pages rendered on-demand
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component (when needed)

### Caching Strategy
- Static assets cached by CDN (Vercel)
- API responses cached when appropriate
- Firestore queries optimized with indexes

### Bundle Size
- Tree-shaking unused code
- Minimal dependencies
- Lazy loading for heavy components

## Scalability Considerations

### Database
- Firestore scales automatically
- Proper indexing for common queries
- Compound indexes for complex queries

### Hosting
- Vercel's edge network for global distribution
- Automatic scaling based on traffic
- Zero-downtime deployments

### Architecture
- Stateless API routes for horizontal scaling
- Client-side caching reduces server load
- Modular component structure for maintainability

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Set up `.env.local` with credentials
4. Run dev server: `npm run dev`
5. Access at `http://localhost:3000`

### Code Quality
- ESLint for code linting (Next.js built-in)
- Prettier for code formatting (to be added)
- Git hooks for pre-commit checks (to be added)

### Deployment
1. Push code to GitHub
2. Vercel auto-deploys on push
3. Preview deployments for PRs
4. Production deployment on merge to main

## Future Enhancements

### AI Integration
- OpenAI GPT-4 for interview feedback
- Speech recognition for voice interviews
- Natural language processing for answer evaluation

### Advanced Features
- Video interview practice with camera
- Company-specific interview prep
- Peer mock interviews
- Interview scheduling assistant
- Performance analytics dashboard

### Integrations
- LinkedIn profile import
- Resume parser
- Job board integrations
- Company research from multiple sources

## Monitoring & Analytics

### To Be Implemented
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- User analytics (Google Analytics or Plausible)
- Logging infrastructure (Winston + CloudWatch)

## Contributing

When contributing to this project:
1. Follow the existing code style
2. Use meaningful commit messages
3. Update documentation for new features
4. Add comments for complex logic
5. Test thoroughly before submitting PR

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
