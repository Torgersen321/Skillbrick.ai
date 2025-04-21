import React, { useState } from 'react';
import { supabase } from '../../lib/supabase'; // Adjust path as necessary
// import { useAuth } from '../../contexts/AuthContext'; // We might use this for redirection or state checks

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const { session } = useAuth(); // Example: Check if already logged in

  // Redirect if already logged in (implement navigation logic as needed)
  // useEffect(() => {
  //   if (session) {
  //     // navigate('/dashboard'); // Example using react-router
  //   }
  // }, [session]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError;
      }

      // Login successful! AuthProvider listener will update the state.
      // You might want to redirect the user here or in a useEffect hook
      // based on the session state change from AuthContext.
      // Example: navigate('/dashboard');
      console.log('Login successful!');

    } catch (err: any) {
      console.error('Error logging in:', err);
      setError(err.error_description || err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="login-email">Email:</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="login-password">Password:</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {/* Add link to password reset page */}
      {/* <Link to="/forgot-password">Forgot Password?</Link> */}
    </form>
  );
};

export default LoginForm; 