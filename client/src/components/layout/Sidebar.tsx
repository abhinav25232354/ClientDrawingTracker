import { useTheme } from "@/context/ThemeContext";
import { useDrawingContext } from "@/context/DrawingContext";
import { useAuth } from "@/context/AuthContext";
import { FileText, CheckCircle, DollarSign, Star, History, Moon, Sun } from "lucide-react";
import { DrawingCategory } from "@/lib/types";

interface SidebarProps {
  setShowSidebar: (show: boolean) => void;
  sidebarOpen: boolean;
}

export function Sidebar({ sidebarOpen, setShowSidebar }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const { activeCategory, setActiveCategory } = useDrawingContext();
  const { user } = useAuth();
  
  const handleCategoryClick = (category: DrawingCategory) => {
    setActiveCategory(category);
  };
  
  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm overflow-y-auto lg:relative lg:translate-x-0 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-primary-500" />
            <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">DrawTrack</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Client Drawing Management</p>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          <button 
            onClick={() => handleCategoryClick(DrawingCategory.LATEST)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
              activeCategory === DrawingCategory.LATEST
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FileText className="mr-3 h-5 w-5" />
            Latest
          </button>
          
          <button 
            onClick={() => handleCategoryClick(DrawingCategory.COMPLETED)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
              activeCategory === DrawingCategory.COMPLETED
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <CheckCircle className="mr-3 h-5 w-5" />
            Completed
          </button>
          
          <button 
            onClick={() => handleCategoryClick(DrawingCategory.INCOME)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
              activeCategory === DrawingCategory.INCOME
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <DollarSign className="mr-3 h-5 w-5" />
            Total Income
          </button>
          
          <button 
            onClick={() => handleCategoryClick(DrawingCategory.FAVORITES)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
              activeCategory === DrawingCategory.FAVORITES
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Star className="mr-3 h-5 w-5" />
            Favorites
          </button>
          
          <button 
            onClick={() => handleCategoryClick(DrawingCategory.HISTORY)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
              activeCategory === DrawingCategory.HISTORY
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <History className="mr-3 h-5 w-5" />
            History
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {user?.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                  {user?.email.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
