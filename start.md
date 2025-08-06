# Quick Start Guide

## Prerequisites Setup

1. **Install MongoDB** (choose one option):
   
   **Option A: MongoDB Atlas (Recommended)**
   - Go to https://www.mongodb.com/atlas
   - Create a free cluster
   - Get your connection string
   - Update `backend/.env` with your connection string:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gymbuddy?retryWrites=true&w=majority
     ```

   **Option B: Local MongoDB**
   ```bash
   # Windows (with Chocolatey)
   choco install mongodb
   
   # macOS (with Homebrew)
   brew install mongodb-community
   
   # Ubuntu
   sudo apt install mongodb
   ```

2. **Install Node.js** (v16 or higher)
   - Download from https://nodejs.org/

3. **For mobile development:**
   ```bash
   npm install -g @expo/cli
   ```

## Running the App

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run seed    # This will populate the database with sample data
npm run dev     # Start the backend server
```

### Terminal 2 - Mobile App  
```bash
cd mobile
npm install
npx expo start  # Start the Expo development server
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Scan QR code with Expo Go app on your phone

## API Base URL Configuration

The mobile app needs to connect to your backend. Adjust the BASE_URL in `mobile/src/services/api.ts`:

- **Android Emulator**: `http://10.0.2.2:3000` (current default)
- **iOS Simulator**: `http://localhost:3000`
- **Physical Device**: `http://YOUR_COMPUTER_IP:3000` (find your IP with `ipconfig` or `ifconfig`)

## Sample Login Credentials

After running `npm run seed`, you can login with:
- alex.chen@stanford.edu / password123
- sarah.johnson@ucla.edu / password123
- mike.rodriguez@berkeley.edu / password123
- emma.davis@usc.edu / password123

## Troubleshooting

### "Can't connect to MongoDB"
- Make sure MongoDB is running locally, or check your Atlas connection string
- Verify the MONGODB_URI in backend/.env

### "Network request failed" in mobile app
- Check that backend is running on port 3000
- Verify the BASE_URL in api.ts matches your setup
- For physical device, use your computer's IP address

### "Module not found" errors
- Run `npm install` in both backend and mobile directories
- Clear Metro cache: `npx expo start --clear`

### Expo/React Native issues
- Make sure you have the latest Expo CLI: `npm install -g @expo/cli`
- Try clearing cache: `npx expo start --clear`

## Development Tips

1. **Backend runs on**: http://localhost:3000
2. **API endpoints**: Check the README.md for full API documentation
3. **Database**: MongoDB with sample data pre-loaded
4. **Real-time features**: Socket.io for chat (will be connected automatically)

## Next Steps

1. Test user registration and login
2. Create workout sessions  
3. View potential matches
4. Accept matches and start chatting
5. Try different school themes by registering users with different schools

The app should now be fully functional for testing the complete workflow!