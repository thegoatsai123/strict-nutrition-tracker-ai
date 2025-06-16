
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-background border-b border-border px-4 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/home" className="flex items-center transition-transform duration-200 hover:scale-105">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2 shadow-md">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-xl font-bold text-foreground">NutriTracker</span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-accent transition-colors duration-200">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                      {getUserInitials(user.user_metadata?.name || user.email || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border shadow-lg" align="end" forceMount>
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')}
                  className="hover:bg-accent transition-colors duration-200"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')}
                  className="hover:bg-accent transition-colors duration-200"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="hover:bg-accent transition-colors duration-200"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
