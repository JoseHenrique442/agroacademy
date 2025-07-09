# AgroAcademy Partner Portal

## Overview

AgroAcademy Partner Portal is a B2B web application for partners of AgroAcademy, the world's largest agricultural drone pilot training school. The portal centralizes all partner operations and provides a comprehensive platform for course management, progress tracking, and partnership benefits administration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom AgroAcademy theme colors
- **State Management**: TanStack Query for server state and caching

**Design Decision**: React with TypeScript provides type safety and excellent developer experience. Vite offers fast development builds and hot module replacement. Shadcn/ui provides a consistent, accessible component system built on proven Radix primitives.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage

**Design Decision**: Express.js provides a mature, flexible backend framework. Drizzle ORM offers excellent TypeScript integration and performance. Replit Auth simplifies authentication while providing security and scalability.

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Relational design with proper foreign key relationships
- **Migrations**: Drizzle Kit for schema migrations and management

**Design Decision**: PostgreSQL provides robust relational data integrity and excellent performance for complex queries. The schema supports partner hierarchies, course enrollments, and progress tracking.

## Key Components

### Authentication System
- Replit Auth integration with OpenID Connect
- Session-based authentication with PostgreSQL session storage
- User profile management with avatar and basic information
- Automatic redirection for unauthorized access

### Partner Management
- Partner profiles with company information and classifications (Bronze, Silver, Gold)
- UTM tag tracking for enrollment attribution
- Performance metrics and completion rates
- Classification system with benefits and privileges

### Course System
- Multiple course types: CAAR, PILOTO DJI, PILOTO ENTERPRISE, COMBO courses
- Enrollment management with status tracking
- Progress monitoring with completion percentages
- Document management for course requirements

### Event Management
- Event creation and management
- Partner registration for events
- Event calendar and scheduling

### UI Components
- Responsive design with mobile-first approach
- Custom classification badges for partner tiers
- Progress tracking components
- Course cards with enrollment actions
- Navigation with sidebar and responsive navbar

## Data Flow

### Authentication Flow
1. User accesses protected routes
2. Replit Auth middleware validates session
3. User profile fetched from database
4. Partner data loaded based on user ID
5. UI renders personalized content

### Course Enrollment Flow
1. Partner browses available courses
2. Enrollment form captures course and partner data
3. UTM tag automatically applied from partner profile
4. Enrollment record created with initial status
5. Progress tracking initiated

### Progress Tracking Flow
1. Course progress updated through API endpoints
2. Partner statistics recalculated automatically
3. Classification potentially updated based on completion
4. Dashboard reflects updated progress and achievements

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database operations
- **express**: Web application framework
- **wouter**: Lightweight client-side routing

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives for form controls, dialogs, dropdowns
- **lucide-react**: Consistent icon library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants

### Authentication Dependencies
- **openid-client**: OpenID Connect client implementation
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- Express server with TypeScript compilation via tsx
- Database migrations applied automatically
- Environment variables for database and auth configuration

### Production Build
- Vite builds optimized frontend bundle to `dist/public`
- ESBuild compiles server code to `dist/index.js`
- Static files served by Express in production
- Database schema pushed via Drizzle migrations

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Session encryption key (required)
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OpenID Connect issuer endpoint

### Deployment Process
1. Install dependencies with npm
2. Build frontend and backend with `npm run build`
3. Push database schema with `npm run db:push`
4. Start production server with `npm start`

**Design Decision**: The deployment strategy leverages Replit's environment while maintaining compatibility with other hosting platforms. The build process creates optimized bundles for production performance while the development setup provides excellent developer experience.