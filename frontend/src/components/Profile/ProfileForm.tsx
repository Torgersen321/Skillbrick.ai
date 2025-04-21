import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // To get user session/token
import { Button } from '../ui/Button'; // Use our Button component
import { Input } from '../ui/Input'; // Use our Input component
import { Spinner } from '../ui/Spinner'; // Use our Spinner component
import { useToast } from '../ui/Toast'; // Use our Toast component
import { cn } from '../../lib/utils';

interface ProfileData {
  id?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  // Add other fields from your 'profiles' table
}

const ProfileForm: React.FC = () => {
  const { session, user } = useAuth(); // Get session for token and user info
  const { addToast } = useToast();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) {
        setLoading(false);
        setError("Not logged in.");
        return; // Should be handled by ProtectedRoute, but good practice
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/profile', { // Ensure API_URL is configured if needed
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data: ProfileData = await response.json();
        setProfile(data);
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setError(err.message || "Failed to load profile data.");
        addToast("Failed to load profile", { type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, addToast]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || !profile) return;

    setError(null); // Clear previous submission errors

    // --- Client-side validation ---
    if (!profile.username || profile.username.trim().length < 3) {
      setError("Username must be at least 3 characters long.");
      addToast("Username must be at least 3 characters long.", { type: 'error' });
      return;
    }
    // Add more validation checks here (e.g., bio length, avatar URL format)
    // if (profile.bio && profile.bio.length > 500) { ... }
    // if (profile.avatar_url && !isValidUrl(profile.avatar_url)) { ... }
    // --- End Validation ---

    setUpdating(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          username: profile.username,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          // Include other updatable fields
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedProfile: ProfileData = await response.json();
      setProfile(updatedProfile); // Update local state with response from backend
      addToast('Profile updated successfully!', { type: 'success' });

    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update profile.");
      addToast("Failed to update profile", { type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-10"><Spinner size="lg" /></div>;
  }

  if (error && !profile) {
    // Show error only if profile couldn't be loaded at all
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!profile) {
      return <p>No profile data found.</p> // Or handle this case differently
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>

      {/* Display non-editable info like email */} 
      {user?.email && (
          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-400">Email</label>
             <p className="text-gray-200 mt-1">{user.email}</p>
          </div>
      )}

      {/* Username Input */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
        <Input
          id="username"
          name="username"
          type="text"
          value={profile.username || ''}
          onChange={handleChange}
          disabled={updating}
          className="w-full"
          // Add required, minLength etc. based on validation rules
        />
      </div>

      {/* Bio Textarea (Example) */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          value={profile.bio || ''}
          onChange={handleChange}
          disabled={updating}
          className={cn("flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", "resize-none")}
        />
      </div>

      {/* Avatar URL Input (Example) */}
      <div>
        <label htmlFor="avatar_url" className="block text-sm font-medium mb-1">Avatar URL</label>
        <Input
          id="avatar_url"
          name="avatar_url"
          type="url"
          value={profile.avatar_url || ''}
          onChange={handleChange}
          disabled={updating}
          className="w-full"
        />
        {profile.avatar_url && <img src={profile.avatar_url} alt="Avatar preview" className="mt-2 h-16 w-16 rounded-full object-cover"/>}
      </div>

      {/* Display update error if exists */} 
      {error && <p className="text-red-500 text-sm">Update Error: {error}</p>}

      <Button type="submit" disabled={updating} className="w-full">
        {updating ? <><Spinner size="sm" className="mr-2"/> Updating...</> : 'Update Profile'}
      </Button>

      {/* --- Account Deletion Section (Placeholder) --- */}
      <hr className="my-6 border-gray-600"/>
      <div className="space-y-3 rounded-md border border-red-500/50 p-4">
        <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
        <p className="text-sm text-gray-400">
          Deleting your account is permanent and cannot be undone. All your learning paths and progress will be lost.
        </p>
        <Button
           variant="destructive"
           onClick={() => {
              // TODO: Implement confirmation modal and deletion logic
              // Example: openConfirmationModal();
              alert("Account deletion not implemented yet.");
           }}
           // Consider adding a disabled state until conditions are met
        >
          Delete Account
        </Button>
        {/* Add confirmation modal component here later */}
      </div>
      {/* --- End Account Deletion Section --- */}

    </form>
  );
};

export default ProfileForm; 