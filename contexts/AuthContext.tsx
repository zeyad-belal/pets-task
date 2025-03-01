import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
} from "react";
import { authService, User } from "../services/authService";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (name: string, password: string) => Promise<void>;
  signUp: (name: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (name: string, password: string) => {
    setLoading(true);
    try {
      const user = await authService.signIn({ name, password });
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, password: string) => {
    setLoading(true);
    try {
      const user = await authService.signUp({ name, password });
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
