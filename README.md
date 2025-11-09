# Resumatic

Modern resume builder with Google sign-in, AI-assisted ATS analysis (Gemini), PDF export, and MongoDB persistence.

## Features

- Google OAuth via Firebase Authentication.
- Dashboard with mini resume previews, view/edit/delete actions, ATS analysis per resume, and resume upload parsing.
- Resume builder with sample/mock data, Gemini-powered ATS modal, PDF export with consistent margins, and toast notifications.
- Express + MongoDB backend for storing user resumes.
- Framer Motion and custom design system for a polished UI across landing, dashboard, and builder pages.

## Tech Stack

- **Frontend:** React (Vite), TypeScript, React Router, Tailwind (utility classes), shadcn/ui, Framer Motion, html2canvas + jsPDF.
- **Backend:** Express, Mongoose, MongoDB.
- **Auth & AI:** Firebase Authentication (Google OAuth), Google Gemini API.

## Prerequisites

- Node.js 18+ and npm.
- MongoDB instance (local or Atlas connection string).
- Firebase project configured for Google sign-in.
- Google AI Studio / Gemini API key.

## Environment Variables

Create a `.env` in the project root (same folder as `package.json`):

```env
# Backend
MONGODB_URI=mongodb://localhost:27017/resumatic

# Firebase
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Gemini
VITE_GEMINI_API_KEY=your-gemini-api-key
```

> Replace the sample values with your actual credentials. For MongoDB Atlas, use the full connection string including database name and options (e.g. `mongodb+srv://.../resumatic?retryWrites=true&w=majority`).

## Installation

```bash
# Install dependencies (client + server dependencies share the root package.json)
npm install
```

## Running the App

### Development (frontend + backend)

```bash
npm run dev:all
```

This runs Vite dev server on port 5173 and the Express API on port 5000. The script uses `concurrently`; logs from both services appear in the same terminal.

### Frontend only

```bash
npm run dev
```

### Backend only

```bash
npm run server
```

Ensure MongoDB is running and accessible at `MONGODB_URI` before starting the server.

## Project Structure

```
src/
  components/       // Shared UI components & templates
  contexts/         // Auth context provider
  pages/            // Home, Dashboard, Builder routes
  services/         // API & Gemini wrappers
  utils/            // Helpers (e.g., PDF export)

server/
  app.js            // Express configuration & middleware
  index.js          // Entry point (loads env, connects DB, starts server)
  config/db.js      // MongoDB connection helper
  controllers/      // CRUD handlers for resumes
  models/           // Mongoose schema definitions
  routes/           // API routing (mounted under /api)
```

## Key Commands

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Start Vite dev server                      |
| `npm run server`   | Start Express API                          |
| `npm run dev:all`  | Start both servers concurrently            |
| `npm run build`    | Type-check and build production bundle     |
| `npm run preview`  | Preview built frontend                     |

## Troubleshooting..

- **Mongo connection errors:** Ensure MongoDB is running locally, or verify Atlas URI, IP whitelist, and credentials.
- **Firebase auth issues:** Confirm Google sign-in is enabled and env vars match Firebase config.
- **Gemini rate limits (429):** The app retries with backoff up to the configured limit; consider slowing requests or upgrading quota.
- **PDF export blank pages:** Make sure the builder’s hidden `resume-preview` element is present; the current implementation slices the canvas to maintain per-page margins.

## Deployment Tips

- Use environment-specific `.env` files or secret managers (e.g., Vercel/Netlify for frontend, Render/Heroku for API).
- Serve the built frontend (`npm run build`) via a static host and deploy the Express server separately (or integrate with Next.js / serverless if desired).
- Configure CORS if frontend and backend domains differ.

## License

This project is proprietary to the original author. Update this section if you plan to share or open source.

