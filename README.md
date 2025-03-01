# ENV 
  EXPO_PUBLIC_SUPABASE_URL=https://wtibbkqyzojrzfakuvwh.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aWJia3F5em9qcnpmYWt1dndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3ODU0MzIsImV4cCI6MjA1NjM2MTQzMn0.LLhyvjL7kzzqGwQbZ2Ano6eiGGQ_W0WKJCKTQd3VAPk

# Pet Health Tracker

A cross-platform mobile application for tracking pet health information including weight logs, body condition assessments, and veterinary visits.

## Features

- User authentication (sign up/sign in)
- View pet profiles with basic information
- Track weight measurements over time
- Monitor body condition assessments
- Record veterinary visits with notes
- Tabbed interface for easy navigation between different health metrics
- Safe area handling for various device types

## Technical Stack

- React Native with Expo
- TypeScript
- Supabase for backend database
- React Navigation for screen navigation
- React Native Safe Area Context for proper device display

## Dependencies

- `@react-navigation/native` and `@react-navigation/native-stack` - For navigation between screens
- `@supabase/supabase-js` - Supabase JavaScript client
- `react-native-url-polyfill` - URL polyfill for React Native
- `react-native-safe-area-context` - For handling safe areas on different devices
- `react-native-screens` - For native screen containers

## Setup Instructions

### Prerequisites

- Node.js and npm
- Expo CLI
- Supabase account

### Start the application:
   npx expo start


Note: For development purposes, Row Level Security (RLS) has been disabled on all tables.

## Application Structure

The application is structured as follows:

- `App.tsx`: The main application component with navigation and SafeAreaProvider
- `screens/auth/`: Authentication screens (SignIn, SignUp)
- `screens/pets/`: Pet management screens (PetsList, AddPet)
- `screens/profiles/`: Pet profile screens with tabbed interface
- `services/`: Service files for Supabase, authentication, and pets
- `contexts/`: Context providers for authentication
- `types/`: TypeScript type definitions

## Usage

1. **Authentication**: Sign in or create a new account
2. **Pet Management**:
   - View all your pets in the Pets List screen
   - Add new pets with the Add Pet button
   - View detailed pet information by tapping on a pet
3. **Pet Profile**:
   - View basic pet information and monthly health summary
   - Use the collapsible Health Logs section to view and add:
     - Weight logs
     - Body condition assessments
     - Vet visit records
   - Toggle between tabs to view different types of health logs
   - Add new logs directly from each tab
