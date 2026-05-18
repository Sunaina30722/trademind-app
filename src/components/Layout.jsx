import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Gamepad2, 
  Briefcase, 
  BarChart3, 
  Target, 
  BookOpen, 
  Trophy, 
  Brain, 
  User, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { toast } from 'sonner';

export default function Layout({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/real-trade', label: 'Real Trade', icon: TrendingUp },
    { path: '/virtual-trade', label: 'Virtual Trade', icon: Gamepad2 },
    { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/discipline', label: 'Discipline', icon: Target },
    { path: '/journal', label: 'Journal', icon: BookOpen },
    { path: '/achievements', label: 'Achievements', icon: Trophy },
    { path: '/ai-coach', label: 'AI Coach', icon: Brain },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-lg font-bold text-foreground">TradeMind</span>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition w-full mb-2"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-loss hover:bg-loss/10 transition w-full"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}