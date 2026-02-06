import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ChefHat, 
  Plus, 
  User, 
  TrendingUp, 
  LogOut, 
  Menu, 
  X,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onAddRecipe?: () => void;
}

const DashboardLayout = ({ children, activeSection, onSectionChange, onAddRecipe }: Props) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'recipes', label: 'Recipes', icon: ChefHat },
    { id: 'add-recipe', label: 'Add Recipe', icon: Plus },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <Flame className="w-8 h-8 text-sidebar-primary" />
              <span className="font-serif text-xl font-bold text-sidebar-foreground">CookOff</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'add-recipe' && onAddRecipe) {
                    onAddRecipe();
                  } else {
                    onSectionChange(item.id);
                  }
                  setSidebarOpen(false);
                }}
                className={cn(
                  "sidebar-nav-item w-full text-left",
                  activeSection === item.id && "active"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="sidebar-nav-item w-full text-left text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <h1 className="font-serif text-xl lg:text-2xl font-bold capitalize">
              {activeSection.replace('-', ' ')}
            </h1>

            {onAddRecipe && (
              <Button onClick={onAddRecipe} className="btn-hero">
                <Plus className="w-4 h-4 mr-2" />
                Add Recipe
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
