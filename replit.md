# Loveletter - AI-Powered Document Generation Platform

## Overview

Loveletter is a modern web application that leverages AI to help users generate and manage various types of business documents including PRDs, BRDs, Technical Specifications, RFPs, and more. The platform features a React-based frontend with a Node.js/Express backend, using PostgreSQL for data persistence and modern UI components for an exceptional user experience.

## System Architecture

The application follows a full-stack architecture with clear separation of concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: Context API with useReducer for complex state
- **Routing**: React Router for client-side navigation
- **HTTP Client**: Axios for API communication
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via Neon serverless)
- **Session Management**: PostgreSQL-backed sessions
- **Build System**: ESBuild for production bundling

### Design System
- **Component Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design tokens
- **Theme**: Light/dark mode support with CSS variables
- **Icons**: Lucide React icons
- **Typography**: Custom gradient branding elements

## Key Components

### Authentication System
- Context-based authentication with JWT tokens
- Protected routes with loading states
- User session management with PostgreSQL storage
- Login/signup with form validation

### Document Management
- Document context for centralized state management
- Support for multiple document types (PRD, BRD, Tech Spec, RFP, etc.)
- Document versioning and status tracking
- Real-time document editing capabilities

### AI Integration
- Chat-based AI assistance for document generation
- Content generation based on user prompts
- Document type-specific AI suggestions
- Usage tracking and analytics

### UI Components
- Responsive design with mobile-first approach
- Reusable component library based on shadcn/ui
- Toast notifications for user feedback
- Modal dialogs and sheets for complex interactions

## Data Flow

1. **User Authentication**: Users authenticate through the frontend, with tokens stored in context
2. **Document Operations**: CRUD operations flow through the document context to backend APIs
3. **AI Generation**: User prompts are sent to AI endpoints, responses update document state
4. **Real-time Updates**: Document changes are reflected immediately in the UI
5. **Persistence**: All data is persisted to PostgreSQL via Drizzle ORM

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router)
- UI libraries (Radix UI primitives, Tailwind CSS)
- Form handling (React Hook Form, Zod)
- HTTP client (Axios)
- State management (TanStack Query)
- File handling (React Dropzone)
- Charts and visualization (Recharts)

### Backend Dependencies
- Express.js framework
- Drizzle ORM with PostgreSQL adapter
- Neon serverless PostgreSQL client
- Session management (connect-pg-simple)
- Development tools (tsx, esbuild)

### Development Tools
- TypeScript for type safety
- Vite for development server and bundling
- ESBuild for backend compilation
- Drizzle Kit for database migrations
- PostCSS and Autoprefixer for CSS processing

## Deployment Strategy

### Development
- Vite development server for frontend with HMR
- tsx for backend development with auto-restart
- Environment-based configuration
- Replit-specific development enhancements

### Production
- Frontend: Vite build with optimized bundle
- Backend: ESBuild compilation to single bundle
- Database: Neon PostgreSQL serverless instance
- Static assets served from Express
- Environment variables for configuration

### Database Management
- Drizzle schema definitions in shared directory
- Migration system via Drizzle Kit
- Connection pooling via Neon serverless
- Automated schema synchronization

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```