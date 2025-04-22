import { DrawingEntry } from "@shared/schema";

export interface DrawingEntryFormData {
  clientName: string;
  drawingTitle: string;
  drawingDescription?: string;
  deadline?: string;
  amount: string;
  completed?: boolean;
  favorite?: boolean;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
  isAdmin: boolean;
}

export interface InvoiceData {
  id: string;
  clientName: string;
  drawingTitle: string;
  drawingDescription?: string;
  amount: string;
  deadline?: string;
  dateCreated: string;
}

export enum DrawingCategory {
  LATEST = 'latest',
  COMPLETED = 'completed',
  INCOME = 'income',
  FAVORITES = 'favorites',
  HISTORY = 'history',
}

export interface SheetsData {
  range: string;
  values: any[][];
}

export interface ContextDrawingEntry extends DrawingEntry {
  dateCreatedFormatted?: string; 
  timeCreatedFormatted?: string;
}
