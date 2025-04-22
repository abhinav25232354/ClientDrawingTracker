import { format } from "date-fns";
import { Star, FileEdit, Trash, CheckCircle, X, Download, User } from "lucide-react";
import { ContextDrawingEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DrawingCardProps {
  entry: ContextDrawingEntry;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  onToggleCompleted: () => void;
  onOpenInvoice: () => void;
}

export function DrawingCard({
  entry,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleCompleted,
  onOpenInvoice
}: DrawingCardProps) {
  const dateStr = format(new Date(entry.dateCreated), 'yyyy-MM-dd');
  const timeStr = format(new Date(entry.dateCreated), 'HH:mm');
  
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
            {entry.drawingTitle}
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={onToggleFavorite}
              className="text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-500"
            >
              <Star className={`h-5 w-5 ${entry.favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <span>{entry.clientName}</span>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {entry.drawingDescription}
        </p>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Deadline</div>
            <div className="mt-1 text-sm text-gray-900 dark:text-white">
              {entry.deadline ? format(new Date(entry.deadline), 'yyyy-MM-dd') : 'Not set'}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</div>
            <div className="mt-1 text-sm text-gray-900 dark:text-white">${entry.amount}</div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <Badge variant={entry.completed ? "success" : "default"}>
              {entry.completed ? "Completed" : "Pending"}
            </Badge>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {dateStr} {timeStr}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between space-x-2">
          <div className="flex space-x-2">
            <Button 
              onClick={onToggleCompleted}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              {entry.completed ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  <span>Reopen</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Complete</span>
                </>
              )}
            </Button>
            
            <Button
              onClick={onOpenInvoice}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              <span>Invoice</span>
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="p-1.5"
            >
              <FileEdit className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={onDelete}
              variant="outline"
              size="sm"
              className="p-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
