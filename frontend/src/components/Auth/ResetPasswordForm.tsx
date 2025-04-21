import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // Adjust path as necessary
// import { useNavigate } from 'react-router-dom'; // Example for redirection

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  // const navigate = useNavigate(); // Example for redirection

  // Supabase sends the access token in the URL fragment after #
  // This effect typically runs on the page loaded from the email link
  // You might need to handle routing and parsing the fragment
  useEffect(() => {
    // Example: Basic fragment parsing (adapt to your routing library)
    const hash = window.location.hash;
    if (!hash.includes('access_token')) {
        // Optional: Show message if accessed without a token
        // setError('Invalid password reset link or token missing.');
    }
    // More robust parsing might be needed
  }, []);

  const handlePasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!password || !confirmPassword) {
      setError('Both password fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Add password strength validation

    setLoading(true);

    try {
      // Supabase automatically handles the token from the URL fragment
      // when the user navigates from the email link if using onAuthStateChange
      // or implicitly during this updateUser call if the session is established correctly.
      // If not, you might need to manually parse and set the session first.
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        // Handle specific errors, e.g., weak password, expired token
        if (updateError.message.includes('expired')) {
          setError('Password reset link has expired. Please request a new one.');
        } else if (updateError.message.includes('minLength')) {
          setError('Password is too short. Please choose a stronger password.');
        } else {
          throw updateError; // Rethrow other errors
        }
      } else {
        setMessage('Password successfully reset! You can now log in with your new password.');
        // Optionally redirect to login page after a delay
        // setTimeout(() => navigate('/login'), 3000);
      }

    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError(err.error_description || err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePasswordReset}>
      <h2>Reset Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <div>
        <label htmlFor="new-password">New Password:</label>
        <input
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          // Add minLength or pattern for password requirements
        />
      </div>
      <div>
        <label htmlFor="confirm-password">Confirm New Password:</label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
};

export default ResetPasswordForm; 