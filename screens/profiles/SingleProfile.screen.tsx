import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Profile } from '../../types';

type RootStackParamList = {
  SingleProfile: { userId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'SingleProfile'>;

// Mock data for development
const mockProfile: Profile = {
  id: '1',
  user_id: '123',
  username: 'johndoe',
  full_name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg',
  updated_at: new Date().toISOString()
};

export const SingleProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const userId = route.params?.userId;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('No user ID provided');
      setLoading(false);
      return;
    }

    // Simulate API call with mock data
    const fetchProfile = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProfile(mockProfile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Profile not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.username}>{profile.username}</Text>
        {profile.full_name && (
          <Text style={styles.fullName}>{profile.full_name}</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fullName: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
}); 