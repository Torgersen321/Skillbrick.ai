import React, { useState } from 'react';
import { supabase } from '../../lib/supabase'; // Adjust path as necessary
// import { useAuth } from '../../contexts/AuthContext'; // May not be needed here directly

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    setMessage(null); // Clear previous messages
    setLoading(true);

    // Basic validation (add more robust validation as needed)
    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }
    // Add password strength validation if desired

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        // options: {
        //   emailRedirectTo: 'http://localhost:5173/welcome', // Optional: Where to redirect after email confirmation
        //   data: { // Optional: additional user metadata
        //     first_name: 'John',
        //   }
        // }
      });

      if (signUpError) {
        throw signUpError;
      }

      // Check if sign up requires email confirmation
      if (data.user && data.user.identities && data.user.identities.length === 0) {
         // This can happen if user already exists but isn't confirmed
         setMessage('User already exists but is not confirmed. Please check your email for confirmation link or try logging in.');
      } else if (data.session) {
         // User is signed up and logged in (if email confirmation is disabled)
         setMessage('Sign up successful! You are now logged in.');
         // Potentially redirect here or let AuthContext listener handle state
      } else if (data.user) {
         // User is signed up but requires confirmation
         setMessage('Sign up successful! Please check your email to confirm your account.');
      } else {
          setMessage('Sign up process initiated. Follow instructions if sent.')
      }

    } catch (err: any) {
      console.error('Error signing up:', err);
      setError(err.error_description || err.message || 'An unexpected error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          // Add minLength or pattern for password requirements
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUpForm; 