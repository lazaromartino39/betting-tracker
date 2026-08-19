# Betting Tracker Mobile App

React Native mobile app for iOS and Android.

## Setup

### Prerequisites
- Node.js 16+
- Ruby (for iOS)
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
cd mobile
npm install
```

### Running on iOS
```bash
npm run ios
```

### Running on Android
```bash
npm run android
```

### Project Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── PlaceBetScreen.tsx
│   │   ├── LiveOddsScreen.tsx
│   │   ├── FeedScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── store/
│   │   └── authStore.ts
│   ├── utils/
│   │   └── storage.ts
│   └── App.tsx
├── android/
├── ios/
└── package.json
```

## Features

- User authentication
- Dashboard with betting stats
- Place bets
- Live odds
- Social feed
- User profile
- Real-time notifications

## TODO

- [ ] Push notifications
- [ ] Offline support
- [ ] Dark mode
- [ ] Biometric authentication
- [ ] Deep linking
- [ ] Share functionality
