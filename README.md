# Betting Tracker Platform

A full-stack social betting tracking application where users can track their bets, follow other bettors, join groups, and see live odds from all major sportsbooks.

## Features

- **User Authentication** — Sign up, sign in with JWT tokens
- **Bet Tracking** — Place and track bets across all sports
- **Live Odds** — Real-time odds from 250+ sportsbooks via The Odds API
- **Social Features** — Follow users, like posts, see friend bets
- **Groups** — Create and join betting groups
- **Dashboard** — Track win/loss stats, total wagered, recent bets

## Tech Stack

- **Frontend**: Next.js 14 with React & TypeScript
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Auth**: JWT + bcryptjs
- **Odds**: The Odds API (api.the-odds-api.com)

## Setup Instructions

### 1. Install Node.js
First, install Node.js from https://nodejs.org (LTS version recommended)

### 2. Install Dependencies
```bash
cd /Users/lauriemartino/Documents/Claude/Projects/betting-tracker
npm install
```

### 3. Set Up Database

Install PostgreSQL:
- Mac: `brew install postgresql@15`
- Or download from https://www.postgresql.org/download/

Start PostgreSQL and create a database:
```bash
# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb betting_tracker
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/betting_tracker"
JWT_SECRET="your_secret_key_here"
ODDS_API_KEY="get_from_https://the-odds-api.com"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

To get The Odds API key:
1. Go to https://the-odds-api.com
2. Sign up for a free account
3. Copy your API key to `.env.local`

### 5. Set Up Database Schema

Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

### 6. Run the App

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Project Structure

```
betting-tracker/
├── pages/
│   ├── api/
│   │   ├── auth/         # Sign up/sign in endpoints
│   │   ├── bets/         # Bet management
│   │   ├── odds/         # Sportsbook odds endpoints
│   │   └── user/         # User profile endpoints
│   ├── _app.tsx          # App wrapper
│   ├── index.tsx         # Home page
│   ├── signin.tsx        # Sign in page
│   ├── signup.tsx        # Sign up page
│   ├── dashboard.tsx     # Main dashboard
│   └── place-bet.tsx     # Bet placement page
├── prisma/
│   └── schema.prisma     # Database schema
├── styles/
│   └── globals.css       # Global Tailwind styles
└── public/               # Static assets
```

## Usage

1. **Sign Up** — Create an account at http://localhost:3000/signup
2. **View Live Odds** — Go to "Place Bet" to see all upcoming events and odds
3. **Place Bets** — Select a sport, event, and place your bet
4. **Track Bets** — See your bet history on the dashboard
5. **Follow Friends** — (Coming soon)
6. **Join Groups** — (Coming soon)

## API Endpoints

### Auth
- `POST /api/auth/signup` — Create account
- `POST /api/auth/signin` — Sign in

### Bets
- `GET /api/bets` — Get user's bets
- `POST /api/bets` — Place a new bet

### Odds
- `GET /api/odds/sports` — List all sports
- `GET /api/odds/events?sport=nfl` — Get events for a sport
- `GET /api/odds/latest?sport=nfl` — Get live odds

### User
- `GET /api/user/me` — Get current user profile

## Next Features to Build

- [ ] Follow users / user profiles
- [ ] Create and manage groups
- [ ] Social posts about bets
- [ ] Like/comment on posts
- [ ] Bet sharing
- [ ] Leaderboards
- [ ] Mobile app with React Native
- [ ] Notifications
- [ ] Live odds websockets
- [ ] Bet insights & analytics

## Troubleshooting

**Database connection error:**
- Make sure PostgreSQL is running: `brew services list`
- Check DATABASE_URL in .env.local
- Verify database exists: `psql -l`

**API key errors:**
- Get a free key at https://the-odds-api.com
- Check ODDS_API_KEY in .env.local

**Port 3000 already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Development

Start Prisma Studio to view database:
```bash
npm run prisma:studio
```

Run migrations:
```bash
npm run prisma:migrate
```

## License

MIT
