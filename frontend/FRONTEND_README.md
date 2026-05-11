# DietiEstates25 Frontend

A modern real estate management platform built with Next.js, Mantine UI, and React Query.

## Features

### User Features
- Browse properties with advanced search and filtering
- View detailed property information with image galleries
- Book property visits
- Make offers on properties
- Manage user profile
- Track bookings and offers

### Agent Features
- List new properties with multiple images
- View property metrics (views, visits, offers)
- Manage property listings
- Accept/reject bookings and offers
- Track performance analytics

### Admin Features
- Manage system administrators and agents
- View system-wide statistics
- Monitor platform health
- System configuration

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL to your backend URL
```

3. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter checks
- `npm run typecheck` - Check TypeScript types
- `npm run jest` - Run unit tests
- `npm run storybook` - Start Storybook for component development

## Project Structure

```
frontend/
├── api/
│   ├── client.ts          # API client and endpoints
│   ├── hooks.ts           # React Query hooks
│   └── apiSchemas.ts      # Generated API types
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── login/             # Authentication
│   ├── properties/        # Browse properties
│   ├── profile/           # User profile
│   ├── agent/             # Agent dashboard
│   ├── admin/             # Admin panel
│   ├── auth-context.tsx   # Auth provider
│   └── providers.tsx      # Query and Auth providers
├── components/
│   ├── Navigation/        # Main navigation
│   ├── ColorSchemeToggle/ # Theme switcher
│   └── Welcome/           # Welcome component
├── public/                # Static assets
└── theme.ts              # Mantine theme configuration
```

## API Integration

The frontend communicates with the backend via REST API. API endpoints are defined in `api/client.ts` and can be consumed using custom hooks from `api/hooks.ts`.

### Example Usage

```typescript
import { useAdvertisementMetrics } from '@/api/hooks';

function MyComponent() {
  const { data, isLoading, error } = useAdvertisementMetrics();
  
  return <div>{/* Use data */}</div>;
}
```

## Authentication

Authentication is handled via JWT tokens stored in localStorage:
- Login/Signup on the `/login` page
- Token is stored after successful authentication
- Protected routes automatically redirect to login if not authenticated
- Use `useAuth()` hook to access auth context

## Styling

The project uses Mantine UI for components and PostCSS for styling. Theme configuration is in `theme.ts`.

## Testing

Run tests with:
```bash
npm run jest
```

Run tests in watch mode:
```bash
npm run jest:watch
```

## Building for Production

```bash
npm run build
npm run start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
