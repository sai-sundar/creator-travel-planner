# Creator Travel Planner

A comprehensive travel content management platform designed for travel creators to plan trips, schedule content, and grow their audience across multiple social media platforms.

## Features

### Trip Planning & Management
- Create and manage travel trips with destinations and dates
- Track multiple destinations within each trip with geolocation support
- Add visit dates and notes for each destination
- Organize trips by location with country-specific categorization

### Content Calendar
- Visual calendar interface for scheduling posts
- AI-powered caption generation with multiple tone options
- Multi-platform content scheduling (Instagram, TikTok, YouTube, etc.)
- Hashtag suggestions and location tagging
- Draft, scheduled, and published status tracking

### Location Database
- Comprehensive database of travel locations and destinations
- Trending score tracking for popular destinations
- Category-based location organization
- Best time to visit recommendations
- Location suggestions for content creation

### Trending Insights
- Real-time trending hashtags tracking
- Usage count analytics for hashtags
- Category-based tag organization
- Data-driven content optimization

### Admin Panel
- Manage location database
- Control trending tags
- Content moderation tools

## Tech Stack

### Frontend
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives with shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React, Tabler Icons, Heroicons

### Backend
- **Database**: SQLite with Turso (libSQL)
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **API**: Next.js API Routes

### Additional Libraries
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Maps**: three-globe for 3D visualizations
- **UI Enhancements**: Various animation and interaction libraries

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd creator-travel-planner
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with required environment variables (refer to your deployment configuration).

4. Run database migrations:
```bash
npm run db:push
# or use drizzle-kit commands directly
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
creator-travel-planner/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── admin/             # Admin panel
│   │   ├── api/               # API routes
│   │   ├── calendar/          # Content calendar page
│   │   ├── dashboard/         # User dashboard
│   │   ├── trips/             # Trip management
│   │   └── sign-in/sign-up/   # Authentication pages
│   ├── components/            # React components
│   │   ├── ui/                # UI component library
│   │   └── DashboardLayout.tsx
│   ├── db/                    # Database configuration
│   │   ├── schema.ts          # Database schema
│   │   ├── seeds/             # Database seed files
│   │   └── index.ts           # Database client
│   ├── lib/                   # Utility functions
│   └── hooks/                 # Custom React hooks
├── drizzle/                   # Drizzle ORM migrations
└── public/                    # Static assets
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The application uses the following main tables:
- **users** - User authentication and profiles
- **trips** - Trip information
- **destinations** - Destination details within trips
- **platforms** - Social media platform selections
- **content_calendar** - Scheduled content posts
- **location_database** - Global location repository
- **trending_tags** - Trending hashtag analytics

## Authentication

The app uses Better Auth for secure authentication with:
- Email/password authentication
- Session management
- User account management
- Protected routes and API endpoints

## Deployment

### Vercel (Recommended)
The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Configure environment variables
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

Ensure your deployment platform supports:
- Node.js 20+
- Environment variables
- SQLite database (or configure an alternative database)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue in the repository.
