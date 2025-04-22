import { FileText, CheckCircle, Plus, DollarSign, Star } from "lucide-react";
import { useDrawingContext } from "@/context/DrawingContext";
import { DrawingCategory } from "@/lib/types";

interface MobileNavigationProps {
  openEntryForm: () => void;
}

export function MobileNavigation({ openEntryForm }: MobileNavigationProps) {
  const { activeCategory, setActiveCategory } = useDrawingContext();
  
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-30">
      <nav className="flex justify-around">
        <button 
          onClick={() => setActiveCategory(DrawingCategory.LATEST)}
          className={`flex flex-col items-center py-3 px-4 text-xs font-medium ${
            activeCategory === DrawingCategory.LATEST
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <FileText className="h-6 w-6 mb-1" />
          Latest
        </button>
        
        <button 
          onClick={() => setActiveCategory(DrawingCategory.COMPLETED)}
          className={`flex flex-col items-center py-3 px-4 text-xs font-medium ${
            activeCategory === DrawingCategory.COMPLETED
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <CheckCircle className="h-6 w-6 mb-1" />
          Completed
        </button>
        
        <button 
          onClick={openEntryForm}
          className="flex flex-col items-center py-3 px-4 text-xs font-medium text-primary-600 dark:text-primary-400"
        >
          <Plus className="h-6 w-6 mb-1" />
          New
        </button>
        
        <button 
          onClick={() => setActiveCategory(DrawingCategory.INCOME)}
          className={`flex flex-col items-center py-3 px-4 text-xs font-medium ${
            activeCategory === DrawingCategory.INCOME
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <DollarSign className="h-6 w-6 mb-1" />
          Income
        </button>
        
        <button 
          onClick={() => setActiveCategory(DrawingCategory.FAVORITES)}
          className={`flex flex-col items-center py-3 px-4 text-xs font-medium ${
            activeCategory === DrawingCategory.FAVORITES
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Star className="h-6 w-6 mb-1" />
          Favorites
        </button>
      </nav>
    </div>
  );
}
