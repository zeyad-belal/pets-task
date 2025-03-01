import { supabase } from "./petService";

export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface SignUpCredentials {
  name: string;
  password: string;
}

export interface SignInCredentials {
  name: string;
  password: string;
}

export const authService = {
  async signUp({ name, password }: SignUpCredentials): Promise<User> {
    try {
      // Check if user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from("users")
        .select("*")
        .eq("name", name);

      if (checkError) {
        throw new Error(checkError.message);
      }

      if (existingUsers && existingUsers.length > 0) {
        throw new Error("User with this name already exists");
      }

      // Insert new user
      const { data, error } = await supabase
        .from("users")
        .insert({ name, password })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Failed to create user");
      }

      return {
        id: data.id,
        name: data.name,
      };
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  },

  async signIn({ name, password }: SignInCredentials): Promise<User> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("name", name)
        .eq("password", password)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Invalid credentials");
      }

      return {
        id: data.id,
        name: data.name,
      };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    // In a real app, you would use Supabase Auth or store the user in AsyncStorage
    // For this demo, we'll just return null
    return null;
  },

  async signOut(): Promise<void> {
    // In a real app, you would use Supabase Auth or clear AsyncStorage
    // For this demo, we'll just return
    return;
  },
};
