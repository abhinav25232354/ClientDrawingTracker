import { Menu, Search } from "lucide-react";
import { useDrawingContext } from "@/context/DrawingContext";
import { DrawingCategory } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  toggleSidebar: () => void;
  openEntryForm: () => void;
}

export function Header({ toggleSidebar, openEntryForm }: HeaderProps) {
  const { activeCategory, searchQuery, setSearchQuery } = useDrawingContext();
  
  const getCategoryTitle = () => {
    switch (activeCategory) {
      case DrawingCategory.LATEST:
        return "Latest Drawings";
      case DrawingCategory.COMPLETED:
        return "Completed Drawings";
      case DrawingCategory.INCOME:
        return "Income Summary";
      case DrawingCategory.FAVORITES:
        return "Favorite Drawings";
      case DrawingCategory.HISTORY:
        return "Drawing History";
      default:
        return "Drawings";
    }
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center px-4 py-3 sm:px-6">
        <div className="flex items-center flex-1">
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {getCategoryTitle()}
            </h2>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative mx-2 flex-1 min-w-0 md:mr-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
              placeholder="Search entries..."
            />
          </div>
          
          <Button onClick={openEntryForm} size="sm">
            New Entry
          </Button>
        </div>
      </div>
    </header>
  );
}
