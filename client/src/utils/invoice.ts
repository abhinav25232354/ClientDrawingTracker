import { jsPDF } from "jspdf";
import { InvoiceData } from "@/lib/types";
import { format } from "date-fns";

export function generateInvoice(data: InvoiceData): void {
  const doc = new jsPDF();
  
  // Set font size and style
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 20, 20);
  
  // Company info
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("DrawTrack", 20, 30);
  doc.text("123 Drawing Lane", 20, 35);
  doc.text("Your City, ST 12345", 20, 40);
  doc.text("admin@drawtrack.com", 20, 45);
  
  // Invoice details
  doc.setFontSize(10);
  doc.text(`Date: ${format(new Date(data.dateCreated), 'yyyy-MM-dd')}`, 150, 30);
  doc.text(`Invoice #: INV-${data.id}`, 150, 35);
  
  // Client info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(data.clientName, 20, 68);
  
  // Table headers
  doc.line(20, 80, 190, 80);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 22, 88);
  doc.text("Amount", 170, 88);
  doc.line(20, 92, 190, 92);
  
  // Item details
  doc.setFont("helvetica", "normal");
  doc.text(data.drawingTitle, 22, 100);
  if (data.drawingDescription) {
    doc.setFontSize(9);
    doc.text(data.drawingDescription, 22, 108, { maxWidth: 140 });
  }
  
  // Calculate line position based on description length
  const linePosition = data.drawingDescription?.length > 80 ? 118 : 110;
  
  // Amount
  doc.setFontSize(11);
  doc.text(`$${data.amount}`, 170, 100);
  
  // Total line
  doc.line(20, linePosition, 190, linePosition);
  doc.setFont("helvetica", "bold");
  doc.text("Total:", 140, linePosition + 10);
  doc.text(`$${data.amount}`, 170, linePosition + 10);
  
  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Thank you for your business. Please make payment by the due date.", 20, linePosition + 25);
  if (data.deadline) {
    doc.text(`Payment is due by: ${data.deadline}`, 20, linePosition + 32);
  }
  
  // Save the PDF
  doc.save(`invoice_${data.id}.pdf`);
}
