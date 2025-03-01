import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SingleProfile } from './screens/profiles/SingleProfile';
import { SignIn } from './screens/auth/SignIn';
import { SignUp } from './screens/auth/SignUp';
import { AddPet } from './screens/pets/AddPet';
import { PetsList } from './screens/pets/PetsList';
import { AuthProvider, useAuth } from './contexts/AuthContext';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  PetsList: undefined;
  AddPet: undefined;
  SingleProfile: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {user ? (
          // User is signed in
          <>
            <Stack.Screen 
              name="PetsList" 
              component={PetsList}
              options={{ title: 'Your Pets', headerShown: false }}
            />
            <Stack.Screen 
              name="AddPet" 
              component={AddPet}
              options={{ title: 'Add Pet', headerShown: true }}
            />
            <Stack.Screen 
              name="SingleProfile" 
              component={SingleProfile}
              options={{ title: 'Pet Profile', headerShown: true }}
            />
          </>
        ) : (
          // User is not signed in
          <>
            <Stack.Screen 
              name="SignIn" 
              component={SignIn} 
              options={{ title: 'Sign In', headerShown: false }}
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUp} 
              options={{ title: 'Sign Up', headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
