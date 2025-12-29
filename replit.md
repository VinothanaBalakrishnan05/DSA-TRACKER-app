# DevTracker - DSA & Interview Preparation Tracker

## Overview

DevTracker is a personal demo application for tracking DSA (Data Structures & Algorithms) and interview preparation progress. It's designed as a motivating, visually satisfying tracker that shows daily streaks, progress bars, and completion status across multiple DSA topics and core interview subjects.

The application is primarily frontend-focused, using browser LocalStorage for data persistence. While it includes a minimal Express server for serving static files, all business logic and state management happens client-side.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: Custom React hook (`use-store.ts`) that wraps LocalStorage operations with useState/useEffect
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with dark theme (custom CSS variables in `index.css`)
- **Animations**: Framer Motion for smooth transitions, canvas-confetti for celebration effects
- **Data Fetching**: TanStack Query is included but minimally used since data is local

### Backend Architecture
- **Server**: Express.js with minimal configuration
- **Purpose**: Serves static files in production, provides Vite dev server middleware in development
- **API Routes**: None required - the application uses LocalStorage for all data persistence

### Data Storage
- **Primary Storage**: Browser LocalStorage (no database required for demo mode)
- **Schema Definition**: Drizzle ORM schema in `shared/schema.ts` defines types shared between client and server
- **Data Structure**: 
  - Topics with subtopics (DSA roadmap items)
  - Daily tasks organized by date
  - Core interview subjects with progress tracking
  - Streak counter and last visit date

### Key Pages
- **Dashboard**: Overview with streak counter, progress circles, and quick stats
- **DSA Topics**: Accordion-based view of all DSA topics with checkable subtopics
- **Daily/Weekly/Monthly Tracker**: Calendar-based task management views
- **Interview Prep (Core Subjects)**: Progress tracking for interview fundamentals
- **Settings**: Data management and reset functionality

### Build System
- **Development**: `npm run dev` runs tsx with Vite middleware
- **Production**: `npm run build` uses custom script that bundles server with esbuild and client with Vite
- **Database**: `npm run db:push` for Drizzle schema migrations (PostgreSQL ready if needed)

## External Dependencies

### UI Libraries
- **Radix UI**: Accessible, unstyled component primitives (accordion, dialog, checkbox, etc.)
- **shadcn/ui**: Pre-styled components built on Radix
- **Lucide React**: Icon library
- **Framer Motion**: Animation library
- **canvas-confetti**: Celebration effects on task completion

### Database (Optional/Future)
- **Drizzle ORM**: Type-safe ORM configured for PostgreSQL
- **PostgreSQL**: Database ready to be provisioned via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session store for Express (not currently used)

### Date Handling
- **date-fns**: Date manipulation for streak calculation and calendar views

### Build Tools
- **Vite**: Frontend bundler with React plugin
- **esbuild**: Server bundler for production
- **TypeScript**: Full type coverage across client, server, and shared code

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development banner