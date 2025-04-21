import React, { useState } from 'react';
import { supabase } from '../../lib/supabase'; // Adjust path as necessary
import { useAuth } from '../../contexts/AuthContext'; // To check if user is logged in

const SignOutButton: React.FC = () => {
  const { session } = useAuth(); // Get session to conditionally render the button
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }
      // Sign out successful! AuthProvider listener handles state update.
      // Navigation/redirect will likely be handled by ProtectedRoute or similar logic
      console.log('Signed out successfully!');
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.error_description || err.message || 'Failed to sign out.');
      // Optionally display the error to the user
    } finally {
      setLoading(false);
    }
  };

  // Only render the button if the user is logged in
  if (!session) {
    return null;
  }

  return (
    <>
      <button onClick={handleSignOut} disabled={loading}>
        {loading ? 'Signing out...' : 'Sign Out'}
      </button>
      {error && <p style={{ color: 'red', fontSize: '0.8em' }}>Error: {error}</p>}
    </>
  );
};

export default SignOutButton; 