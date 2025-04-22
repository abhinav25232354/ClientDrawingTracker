import { useState } from "react";
import { useDrawingContext } from "@/context/DrawingContext";
import { DrawingCategory, ContextDrawingEntry } from "@/lib/types";

export function useDrawingEntries() {
  const {
    entries,
    isLoading,
    activeCategory,
    setActiveCategory,
    addEntry,
    updateEntry,
    deleteEntry,
    toggleFavorite,
    toggleCompleted,
    searchQuery,
    setSearchQuery,
    totalIncome,
    getFilteredEntries
  } = useDrawingContext();
  
  const [currentEntry, setCurrentEntry] = useState<ContextDrawingEntry | null>(null);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  const openEntryForm = (entry: ContextDrawingEntry | null = null) => {
    setCurrentEntry(entry);
    setShowEntryForm(true);
  };
  
  const closeEntryForm = () => {
    setCurrentEntry(null);
    setShowEntryForm(false);
  };
  
  const openInvoiceModal = (entry: ContextDrawingEntry) => {
    setCurrentEntry(entry);
    setShowInvoiceModal(true);
  };
  
  const closeInvoiceModal = () => {
    setCurrentEntry(null);
    setShowInvoiceModal(false);
  };
  
  const confirmDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      await deleteEntry(id);
    }
  };
  
  const getCompletedCount = () => entries.filter(e => e.completed).length;
  const getPendingCount = () => entries.filter(e => !e.completed).length;
  
  const getClientIncomeBreakdown = () => {
    const clients = [...new Set(entries.map(e => e.clientName))];
    return clients.map(client => {
      const clientEntries = entries.filter(e => e.clientName === client);
      const totalAmount = clientEntries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
      return {
        clientName: client,
        projectCount: clientEntries.length,
        totalAmount
      };
    });
  };
  
  return {
    entries,
    filteredEntries: getFilteredEntries(),
    isLoading,
    activeCategory,
    setActiveCategory,
    currentEntry,
    showEntryForm,
    showInvoiceModal,
    searchQuery,
    setSearchQuery,
    openEntryForm,
    closeEntryForm,
    openInvoiceModal,
    closeInvoiceModal,
    addEntry,
    updateEntry,
    confirmDelete,
    toggleFavorite,
    toggleCompleted,
    totalIncome,
    getCompletedCount,
    getPendingCount,
    getClientIncomeBreakdown
  };
}
