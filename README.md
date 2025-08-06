# GymBuddy MVP

A React Native mobile app that connects university students for workout sessions through intelligent matching.

## Features

- **User Management**: Registration, login, and profile management with photo upload
- **Session Creation**: Create workout sessions with date, time, type, and partner preferences
- **Smart Matching**: Algorithm-based matching system using time proximity, age compatibility, school, and motivation
- **Real-time Chat**: Messaging system for matched users with message history
- **Multi-tenant Theming**: School-specific color schemes and branding
- **Cross-platform**: Built with React Native/Expo for iOS and Android

## Tech Stack

### Frontend
- React Native + Expo
- TypeScript
- React Navigation
- React Native Gifted Chat
- Expo Image Picker
- AsyncStorage

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io for real-time features
- JWT authentication
- Multer for file uploads
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Expo CLI
- iOS Simulator or Android Emulator

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB connection string and JWT secrets

5. Seed the database with sample data:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on http://localhost:3000

### Frontend Setup

1. Navigate to mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Run on iOS Simulator:
   ```bash
   npm run ios
   ```

5. Run on Android Emulator:
   ```bash
   npm run android
   ```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `POST /users/upload-photo` - Upload profile photo
- `GET /users/schools` - Get available schools

### Sessions
- `GET /sessions` - Get potential matches for user's sessions
- `POST /sessions` - Create new workout session
- `GET /sessions/my-sessions` - Get user's created sessions
- `PUT /sessions/:id` - Update session
- `DELETE /sessions/:id` - Cancel session

### Matches
- `GET /matches` - Get user's matches
- `POST /matches/:id/accept` - Accept a match
- `POST /matches/:id/decline` - Decline a match

### Messages
- `GET /messages/:matchId` - Get messages for a match
- `POST /messages/:matchId` - Send message

### Themes
- `GET /themes` - Get all available themes
- `GET /themes/:school` - Get theme for specific school

## Database Schema

### Users
```javascript
{
  email: String,
  password: String (hashed),
  name: String,
  school: String,
  gender: String,
  birthday: Date,
  age: Number,
  homeGym: String,
  motivation: String,
  description: String,
  photoUrl: String,
  preferences: {
    ageMin: Number,
    ageMax: Number,
    preferredGender: String,
    workoutTypes: [String]
  }
}
```

### Sessions
```javascript
{
  creatorId: ObjectId,
  date: Date,
  time: String,
  duration: Number,
  workoutType: String,
  preferredAgeMin: Number,
  preferredAgeMax: Number,
  preferredGender: String,
  gym: String,
  description: String,
  status: String
}
```

### Matches
```javascript
{
  sessionA: ObjectId,
  sessionB: ObjectId,
  userA: ObjectId,
  userB: ObjectId,
  score: Number,
  status: String,
  acceptedBy: [ObjectId],
  expiresAt: Date,
  chatRoomId: String
}
```

## Matching Algorithm

The matching system uses weighted scoring:

1. **Hard Constraints** (database query):
   - Same date
   - Same workout type
   - Compatible gender preferences
   - Both sessions active

2. **Soft Scoring** (application logic):
   - Time proximity (±30 min): up to 40 points
   - Age overlap: up to 30 points
   - Same school bonus: 20 points
   - Same motivation bonus: 10 points
   - Minimum match score: 30 points

## Sample Users

The seeded database includes 8 sample users across 4 universities:
- Stanford University
- UCLA
- UC Berkeley
- USC

Login with any of these accounts:
- alex.chen@stanford.edu / password123
- sarah.johnson@ucla.edu / password123
- mike.rodriguez@berkeley.edu / password123
- emma.davis@usc.edu / password123
- james.kim@stanford.edu / password123
- lisa.wang@ucla.edu / password123
- tom.brown@berkeley.edu / password123
- sophia.martinez@usc.edu / password123

## Development Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data

### Frontend
- `npx expo start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser

## Deployment

### Backend
1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Set environment variables in production:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - JWT signing secret
   - `JWT_REFRESH_SECRET` - JWT refresh token secret
   - `NODE_ENV=production`

3. Start the server:
   ```bash
   npm start
   ```

### Frontend
1. Build for production:
   ```bash
   npx expo build
   ```

2. Follow Expo's deployment guides for App Store and Google Play

## Testing

### Running Tests
```bash
# Backend tests (when implemented)
cd backend && npm test

# Frontend tests (when implemented)
cd mobile && npm test
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Profile creation and editing
- [ ] Photo upload
- [ ] Session creation and management
- [ ] Match discovery and acceptance
- [ ] Real-time messaging
- [ ] Theme switching between schools

## Architecture Decisions

1. **React Native + Expo**: Enables cross-platform development with shared codebase
2. **MongoDB**: Flexible schema for user profiles and matching data
3. **JWT Authentication**: Stateless authentication with refresh tokens
4. **Context API**: State management for auth, theme, and user data
5. **Socket.io**: Real-time messaging capabilities
6. **TypeScript**: Type safety across frontend and backend

## Future Enhancements

- Push notifications for matches and messages
- Advanced filtering options
- Group workout sessions
- Workout history tracking
- Social features (friend connections)
- Integration with fitness trackers
- Video chat capabilities
- Gym check-in features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.