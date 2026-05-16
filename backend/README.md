# Health & Fitness Tracker - Backend

Backend API for Health and Fitness Tracking application with Gamification features.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
MONGODB_URI=mongodb://localhost:27017/health-fitness-app
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-secret-key-here-change-in-production
CORS_ORIGIN=http://localhost:3000
```

3. Start MongoDB (if running locally)

4. Initialize default badges:
```bash
node backend/scripts/initializeBadges.js
```

5. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Activities
- `POST /api/activities` - Create activity
- `GET /api/activities` - Get activities (with filters)
- `GET /api/activities/today` - Get today's activity
- `GET /api/activities/stats` - Get activity statistics
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Gamification
- `GET /api/gamification/points` - Get points and level
- `GET /api/gamification/badges` - Get user's badges
- `GET /api/gamification/available-badges` - Get all badges with status
- `GET /api/gamification/level` - Get level information

