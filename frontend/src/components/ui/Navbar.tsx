import React from 'react';
import { Link } from 'react-router-dom'; // Assuming use of react-router-dom
import { cn } from '../../lib/utils'; // Adjust path as necessary
import SignOutButton from '../Auth/SignOutButton'; // Import the sign out button
import { useAuth } from '../../contexts/AuthContext'; // To conditionally show links

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

const Navbar: React.FC<NavbarProps> = ({ className, ...props }) => {
  const { session } = useAuth();

  return (
    <nav
      className={cn(
        'flex items-center justify-between p-4 bg-card text-card-foreground border-b border-border shadow-sm',
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-lg font-semibold">
          SkillBrick.AI
        </Link>
        {/* Add other nav links here, potentially checking session state */}
        <Link to="/dashboard" className="text-sm hover:underline">Dashboard</Link>
      </div>

      <div className="flex items-center space-x-4">
        {!session && (
            <> 
               <Link to="/login" className="text-sm hover:underline">Login</Link>
               <Link to="/signup" className="text-sm hover:underline">Sign Up</Link>
            </>
        )}
        {/* Conditionally render SignOutButton if user is logged in */}
        <SignOutButton />
      </div>
    </nav>
  );
};

export { Navbar }; 