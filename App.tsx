import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { SingleProfileScreen } from './screens/profiles/SingleProfile.screen';
import { SignInScreen } from './screens/auth/SignIn.screen';
import { SignUpScreen } from './screens/auth/SignUp.screen';
import { AddPetScreen } from './screens/pets/AddPet.screen';
import { PetsListScreen } from './screens/pets/PetsList.screen';
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
              component={PetsListScreen}
              options={{ title: 'Your Pets', headerShown: false }}
            />
            <Stack.Screen 
              name="AddPet" 
              component={AddPetScreen}
              options={{ title: 'Add Pet', headerShown: true }}
            />
            <Stack.Screen 
              name="SingleProfile" 
              component={SingleProfileScreen}
              options={{ title: 'Pet Profile', headerShown: true }}
            />
          </>
        ) : (
          // User is not signed in
          <>
            <Stack.Screen 
              name="SignIn" 
              component={SignInScreen} 
              options={{ title: 'Sign In', headerShown: false }}
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen} 
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
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
