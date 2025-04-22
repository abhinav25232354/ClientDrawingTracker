import { useState } from "react";
import { DrawingCard } from "@/components/drawing/DrawingCard";
import { DrawingEntryForm } from "@/components/drawing/DrawingEntryForm";
import { InvoiceModal } from "@/components/invoice/InvoiceModal";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { useDrawingEntries } from "@/hooks/useDrawingEntries";
import { DrawingEntryFormData, DrawingCategory } from "@/lib/types";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const { 
    filteredEntries, 
    activeCategory, 
    isLoading,
    showEntryForm,
    showInvoiceModal,
    currentEntry,
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
  } = useDrawingEntries();
  

  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSaveEntry = async (data: DrawingEntryFormData) => {
    if (currentEntry) {
      await updateEntry(currentEntry.id, data);
    } else {
      await addEntry(data);
    }
    closeEntryForm();
  };
  
  return (
    <>
      
      {/* Main Layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setShowSidebar={setSidebarOpen} 
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header 
            toggleSidebar={toggleSidebar} 
            openEntryForm={() => openEntryForm(null)} 
          />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-6">
            {/* Income Summary Tab */}
            {activeCategory === DrawingCategory.INCOME && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Income Summary</h3>
                  
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Income</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">${totalIncome.toFixed(2)}</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Completed Projects</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">{getCompletedCount()}</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Pending Projects</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900 dark:text-white">{getPendingCount()}</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-md leading-6 font-medium text-gray-900 dark:text-white mb-4">Income Breakdown by Client</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-600">
                      {getClientIncomeBreakdown().map((client, index) => (
                        <div key={index} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {client.clientName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ${client.totalAmount.toFixed(2)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            {client.projectCount} project(s)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Entries List (Latest, Completed, Favorites, History) */}
            {activeCategory !== DrawingCategory.INCOME && (
              <>
                {/* Empty state */}
                {filteredEntries.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No entries found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by creating a new drawing entry.
                    </p>
                    <div className="mt-6">
                      <button 
                        onClick={() => openEntryForm(null)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        New Entry
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Loading state */}
                {isLoading && (
                  <div className="text-center py-12">
                    <svg className="animate-spin -ml-1 mr-3 h-12 w-12 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">Loading entries...</h3>
                  </div>
                )}
                
                {/* Entries grid */}
                {filteredEntries.length > 0 && !isLoading && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEntries.map(entry => (
                      <DrawingCard
                        key={entry.id}
                        entry={entry}
                        onEdit={() => openEntryForm(entry)}
                        onDelete={() => confirmDelete(entry.id)}
                        onToggleFavorite={() => toggleFavorite(entry.id)}
                        onToggleCompleted={() => toggleCompleted(entry.id)}
                        onOpenInvoice={() => openInvoiceModal(entry)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      
      {/* Entry Form Modal */}
      {showEntryForm && (
        <DrawingEntryForm
          entry={currentEntry}
          onSave={handleSaveEntry}
          onCancel={closeEntryForm}
        />
      )}
      
      {/* Invoice Modal */}
      {showInvoiceModal && currentEntry && (
        <InvoiceModal
          entry={currentEntry}
          onClose={closeInvoiceModal}
        />
      )}
      
      {/* Mobile Navigation */}
      <MobileNavigation
        openEntryForm={() => openEntryForm(null)}
      />
    </>
  );
}
