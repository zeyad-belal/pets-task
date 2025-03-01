# ENV 
  EXPO_PUBLIC_SUPABASE_URL=https://wtibbkqyzojrzfakuvwh.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aWJia3F5em9qcnpmYWt1dndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3ODU0MzIsImV4cCI6MjA1NjM2MTQzMn0.LLhyvjL7kzzqGwQbZ2Ano6eiGGQ_W0WKJCKTQd3VAPk

# Pet Health Tracker

A cross-platform mobile application for tracking pet health information including weight logs, body condition assessments, and veterinary visits.

## Features

- View pet profiles with basic information
- Track weight measurements over time
- Monitor body condition assessments
- Record veterinary visits with notes
- Tabbed interface for easy navigation between different health metrics
- Cross-platform compatibility (iOS and Android)
- Supabase integration for data storage and retrieval
- User authentication system

## Technical Stack

- React Native with Expo
- TypeScript
- Supabase for backend database
- Custom tab implementation for the tabbed interface

## Dependencies

- `@react-navigation/native` and `@react-navigation/native-stack` - For navigation between screens
- `@supabase/supabase-js` - Supabase JavaScript client
- `react-native-url-polyfill` - URL polyfill for React Native
- `expo-secure-store` - For securely storing authentication tokens
- `react-native-dotenv` - For loading environment variables

## Assumptions and Design Decisions

1. **Authentication Approach**:
   - Custom authentication system using Supabase tables rather than Supabase Auth
   - Passwords are stored in plaintext for simplicity (in a production app, they should be hashed)
   - User sessions are maintained using React Context

2. **Data Structure**:
   - Each pet belongs to a single owner
   - Health logs (weight, body condition, vet visits) are stored in separate tables
   - All logs are associated with a pet through the pet_id foreign key

3. **UI/UX Decisions**:
   - Tabbed interface for easy navigation between different types of health logs
   - Initial pet creation includes options for all types of health logs
   - Sign-out button placed in the pet profile screen for easy access
   - Form validation to ensure required fields are filled

4. **Error Handling**:
   - Comprehensive error handling for all Supabase operations
   - User-friendly error messages displayed using Alert component
   - Loading states to indicate when operations are in progress

5. **Cross-Platform Considerations**:
   - Used platform-agnostic components for consistent behavior
   - Tested layout on different screen sizes
   - Ensured text input fields support all languages and character sets

## Setup Instructions

### Prerequisites

- Node.js and npm
- Expo CLI
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following environment variables:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase URL and anon key

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL queries provided below to create the necessary tables
   - **Important**: Disable Row Level Security (RLS) for the users table (see below)

5. Start the application:
   ```
   npm start
   ```

### Supabase Setup

1. Create the following tables in your Supabase project:

```sql
-- Pets table
create table pets (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  species text not null,
  breed text,
  age integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references auth.users not null
);

-- Weight logs table
create table weight_logs (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references pets not null,
  weight decimal not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Body condition logs table
create table body_condition_logs (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references pets not null,
  body_condition text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Vet visit logs table
create table vet_visit_logs (
  id uuid default uuid_generate_v4() primary key,
  pet_id uuid references pets not null,
  notes text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Users table
create table users (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

2. **Row Level Security (RLS) Setup**:

You have two options for handling Row Level Security:

**Option 1: Disable RLS for Development (Quick Fix)**

If you encounter an error like "new row violates row-level security policy for table users" or "new row violates row-level security policy for table pets", you can disable RLS for these tables:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE pets DISABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE body_condition_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE vet_visit_logs DISABLE ROW LEVEL SECURITY;
```

**Option 2: Proper RLS Policies for Production (Recommended)**

For a production application, you should create proper RLS policies instead of disabling RLS completely:

```sql
-- For the pets table
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own pets
CREATE POLICY "Users can insert their own pets" ON pets
  FOR INSERT 
  WITH CHECK (owner_id = auth.uid() OR owner_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policy to allow users to view their own pets
CREATE POLICY "Users can view their own pets" ON pets
  FOR SELECT
  USING (owner_id = auth.uid() OR owner_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policy to allow users to update their own pets
CREATE POLICY "Users can update their own pets" ON pets
  FOR UPDATE
  USING (owner_id = auth.uid() OR owner_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policy to allow users to delete their own pets
CREATE POLICY "Users can delete their own pets" ON pets
  FOR DELETE
  USING (owner_id = auth.uid() OR owner_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

-- Similar policies for weight_logs, body_condition_logs, and vet_visit_logs
-- Example for weight_logs:
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert logs for their own pets
CREATE POLICY "Users can insert logs for their own pets" ON weight_logs
  FOR INSERT 
  WITH CHECK (
    pet_id IN (
      SELECT id FROM pets WHERE owner_id = auth.uid() OR owner_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- Create policy to allow users to view logs for their own pets
CREATE POLICY "Users can view logs for their own pets" ON weight_logs
  FOR SELECT
  USING (
    pet_id IN (
      SELECT id FROM pets WHERE owner_id = auth.uid() OR owner_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );
```

Apply similar policies to the other log tables (body_condition_logs and vet_visit_logs).

## Application Structure

The application is structured as follows:

- `App.tsx`: The main application component with navigation
- `screens/auth/`: Authentication screens (SignIn, SignUp)
- `screens/profiles/`: Pet profile screens with tabbed interface
- `services/`: Service files for Supabase, authentication, and pets
- `contexts/`: Context providers for authentication
- `types/`: TypeScript type definitions

## Usage

The application displays pet information along with their health logs in a tabbed interface:

1. **Authentication**: Sign in or create a new account
2. **Navigation Flow**:
   - After signing in, users are directed to the "Pets List" screen showing all their pets
   - Clicking on a pet navigates to that pet's profile screen
   - If the user has no pets, they can add their first pet from the Pets List screen
3. **Pet Creation**: Add a new pet with initial health information:
   - Basic information: name, species, breed, age
   - Initial weight measurement
   - Initial body condition assessment (optional)
   - Initial vet visit notes (optional)
4. **Pet Information**: The top section displays basic pet information and a monthly summary
5. **Collapsible Health Logs Section**:
   - A single collapsible "Health Logs" section with one arrow button to expand/collapse all logs
   - When collapsed, the section appears as a bar at the bottom of the screen
   - When expanded, displays a tabbed interface with three tabs:
     - **Weight Logs Tab**: Displays weight measurements with dates
       - Includes an input field to add new weight logs directly
     - **Body Condition Tab**: Displays body condition assessments
       - Includes an input field to add new body condition logs directly
     - **Vet Visits Tab**: Displays veterinary visit records
       - Includes an input field to add new vet visit notes directly
   - Users can toggle between tabs to view different types of health logs
   - When logs are collapsed, the pet information section expands to fill the screen

## Cross-Platform Compatibility

The application has been designed to work on both iOS and Android platforms. It uses React Native components that are compatible with both platforms and has been tested to ensure consistent behavior.

## Error Handling

The application includes proper error handling for Supabase operations:
- Loading states are displayed while data is being fetched
- Error messages are displayed if there are issues with data fetching
- Retry options are provided for error recovery
