import { createContext, useContext, ReactNode, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { DrawingCategory, ContextDrawingEntry, DrawingEntryFormData } from "@/lib/types";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface DrawingContextType {
  entries: ContextDrawingEntry[];
  isLoading: boolean;
  activeCategory: DrawingCategory;
  setActiveCategory: (category: DrawingCategory) => void;
  addEntry: (entry: DrawingEntryFormData) => Promise<void>;
  updateEntry: (id: number, entry: DrawingEntryFormData) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  toggleCompleted: (id: number) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalIncome: number;
  getFilteredEntries: () => ContextDrawingEntry[];
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export function DrawingProvider({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<DrawingCategory>(() => {
    const savedCategory = localStorage.getItem("activeCategory");
    return (savedCategory as DrawingCategory) || DrawingCategory.LATEST;
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: entries = [], isLoading } = useQuery<ContextDrawingEntry[]>({
    queryKey: ["/api/drawings"],
    onSuccess: (data) => {
      // Process date formatting for each entry
      return data.map(entry => ({
        ...entry,
        dateCreatedFormatted: format(new Date(entry.dateCreated), 'yyyy-MM-dd'),
        timeCreatedFormatted: format(new Date(entry.dateCreated), 'HH:mm')
      }));
    }
  });
  
  const addEntryMutation = useMutation({
    mutationFn: async (entry: DrawingEntryFormData) => {
      await apiRequest("POST", "/api/drawings", entry);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Drawing entry added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/drawings"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add drawing entry: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
  
  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, entry }: { id: number; entry: DrawingEntryFormData }) => {
      await apiRequest("PATCH", `/api/drawings/${id}`, entry);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Drawing entry updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/drawings"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update drawing entry: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
  
  const deleteEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/drawings/${id}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Drawing entry deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/drawings"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete drawing entry: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
  
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (id: number) => {
      const entry = entries.find(e => e.id === id);
      if (!entry) throw new Error("Entry not found");
      
      await apiRequest("PATCH", `/api/drawings/${id}/favorite`, {
        favorite: !entry.favorite
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drawings"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update favorite status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
  
  const toggleCompletedMutation = useMutation({
    mutationFn: async (id: number) => {
      const entry = entries.find(e => e.id === id);
      if (!entry) throw new Error("Entry not found");
      
      await apiRequest("PATCH", `/api/drawings/${id}/complete`, {
        completed: !entry.completed
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drawings"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update completion status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
  
  const addEntry = async (entry: DrawingEntryFormData) => {
    await addEntryMutation.mutateAsync(entry);
  };
  
  const updateEntry = async (id: number, entry: DrawingEntryFormData) => {
    await updateEntryMutation.mutateAsync({ id, entry });
  };
  
  const deleteEntry = async (id: number) => {
    await deleteEntryMutation.mutateAsync(id);
  };
  
  const toggleFavorite = async (id: number) => {
    await toggleFavoriteMutation.mutateAsync(id);
  };
  
  const toggleCompleted = async (id: number) => {
    await toggleCompletedMutation.mutateAsync(id);
  };
  
  const totalIncome = entries.reduce((sum, entry) => {
    return sum + (parseFloat(entry.amount) || 0);
  }, 0);
  
  const getFilteredEntries = () => {
    let filtered = [...entries];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.clientName.toLowerCase().includes(query) || 
        entry.drawingTitle.toLowerCase().includes(query) || 
        (entry.drawingDescription || "").toLowerCase().includes(query)
      );
    }
    
    // Category filters
    if (activeCategory === DrawingCategory.LATEST) {
      filtered.sort((a, b) => {
        const dateA = new Date(a.dateCreated);
        const dateB = new Date(b.dateCreated);
        return dateB.getTime() - dateA.getTime();
      });
    } else if (activeCategory === DrawingCategory.COMPLETED) {
      filtered = filtered.filter(entry => entry.completed);
    } else if (activeCategory === DrawingCategory.FAVORITES) {
      filtered = filtered.filter(entry => entry.favorite);
    } else if (activeCategory === DrawingCategory.HISTORY) {
      // All entries sorted by date
      filtered.sort((a, b) => {
        const dateA = new Date(a.dateCreated);
        const dateB = new Date(b.dateCreated);
        return dateB.getTime() - dateA.getTime();
      });
    }
    
    return filtered;
  };
  
  return (
    <DrawingContext.Provider
      value={{
        entries,
        isLoading,
        activeCategory,
        setActiveCategory: (category) => {
          setActiveCategory(category);
          localStorage.setItem("activeCategory", category);
        },
        addEntry,
        updateEntry,
        deleteEntry,
        toggleFavorite,
        toggleCompleted,
        searchQuery,
        setSearchQuery,
        totalIncome,
        getFilteredEntries
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
}

export function useDrawingContext() {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error("useDrawingContext must be used within a DrawingProvider");
  }
  return context;
}
