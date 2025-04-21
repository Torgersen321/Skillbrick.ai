import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase'; // Assuming supabase client is exported from here

// Define the shape of the context state
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  // Optional: Add auth methods like login, logout if managing them via context
  // signOut: () => Promise<void>;
}

// Create the context with a default value
// Using '!' asserts that the context will be provided, handle with care or provide a default implementation
const AuthContext = createContext<AuthContextType>(null!);

// Create a provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error("Error fetching initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up the listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log(`Auth event: ${_event}`, newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        // setLoading(false); // Already handled by initial fetch or can be set here too
      }
    );

    // Cleanup function to unsubscribe the listener
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Value provided to consuming components
  const value = {
    session,
    user,
    loading,
    // Optional: Add methods here
    // signOut: async () => { await supabase.auth.signOut(); /* State updates handled by listener */ }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Optionally render children only when loading is false */}
      {/* Or always render children and let them handle the loading state */}
      {/* {children} */}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 