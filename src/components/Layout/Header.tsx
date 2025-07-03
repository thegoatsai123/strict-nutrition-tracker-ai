
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
    <header className="bg-background/95 backdrop-blur-lg border-b border-border/50 px-4 py-3 transition-all duration-300 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/home" className="flex items-center group transition-all duration-200 hover-scale">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-variant rounded-xl flex items-center justify-center mr-3 shadow-md group-hover:shadow-lg transition-all duration-200">
            <span className="text-primary-foreground font-bold text-lg">N</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gradient leading-none">NutriTracker</span>
            <span className="text-xs text-muted-foreground leading-none">Smart Nutrition</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/home" 
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 story-link"
          >
            Dashboard
          </Link>
          <Link 
            to="/log-food" 
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 story-link"
          >
            Log Food
          </Link>
          <Link 
            to="/analytics" 
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 story-link"
          >
            Analytics
          </Link>
          <Link 
            to="/meal-planner" 
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 story-link"
          >
            Meal Plans
          </Link>
          <Link 
            to="/community" 
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 story-link"
          >
            Community
          </Link>
          <Link 
            to="/future-features" 
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 story-link"
          >
            Future
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-accent/50 transition-all duration-200 hover-lift">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20 transition-all duration-200">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary-variant text-primary-foreground font-semibold">
                      {getUserInitials(user.user_metadata?.name || user.email || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-card border-border/50 shadow-xl" align="end" forceMount>
                <div className="px-3 py-2 border-b border-border/30">
                  <p className="text-sm font-medium text-foreground">{user.user_metadata?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')}
                  className="hover:bg-accent/50 transition-colors duration-200 cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4 text-primary" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')}
                  className="hover:bg-accent/50 transition-colors duration-200 cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4 text-primary" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 cursor-pointer border-t border-border/30 mt-1"
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
