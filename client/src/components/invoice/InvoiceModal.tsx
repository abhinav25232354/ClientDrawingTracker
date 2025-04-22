import { format } from "date-fns";
import { X } from "lucide-react";
import { ContextDrawingEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { generateInvoice } from "@/utils/invoice";

interface InvoiceModalProps {
  entry: ContextDrawingEntry;
  onClose: () => void;
}

export function InvoiceModal({ entry, onClose }: InvoiceModalProps) {
  const handleDownload = () => {
    const invoiceData = {
      id: entry.id.toString(),
      clientName: entry.clientName,
      drawingTitle: entry.drawingTitle,
      drawingDescription: entry.drawingDescription,
      amount: entry.amount,
      deadline: entry.deadline ? format(new Date(entry.deadline), 'yyyy-MM-dd') : undefined,
      dateCreated: format(new Date(entry.dateCreated), 'yyyy-MM-dd')
    };
    
    generateInvoice(invoiceData);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Invoice Preview</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">INVOICE</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date: {format(new Date(entry.dateCreated), 'yyyy-MM-dd')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Invoice #: INV-{entry.id}
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">DrawTrack</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">123 Drawing Lane</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your City, ST 12345</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">admin@drawtrack.com</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300">Bill To:</h4>
              <p className="text-md text-gray-900 dark:text-white font-medium">{entry.clientName}</p>
            </div>
            
            <div className="mt-6">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  <tr>
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="font-medium">{entry.drawingTitle}</div>
                      <div className="text-gray-500 dark:text-gray-400">{entry.drawingDescription}</div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white text-right">${entry.amount}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900 dark:text-white text-right">Total:</td>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900 dark:text-white text-right">${entry.amount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mt-8 border-t border-gray-200 dark:border-gray-600 pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Thank you for your business. Please make payment by the due date.</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Payment is due by: {entry.deadline ? format(new Date(entry.deadline), 'yyyy-MM-dd') : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleDownload} className="flex items-center">
              <svg className="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
              </svg>
              Download Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
