import { google } from "googleapis";
import { storage } from "./storage";

// Constants
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SHEET_NAME = "DrawingEntries";
const RANGE = `${SHEET_NAME}!A:J`;

let sheetsAPI: any = null;

export async function initializeSheetsAPI() {
  try {
    // Use service account auth in production
    if (process.env.GOOGLE_SERVICE_ACCOUNT) {
      const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      
      sheetsAPI = google.sheets({ version: "v4", auth });
      console.log("Google Sheets API initialized with service account");
      
      // Check if spreadsheet exists and create if needed
      await ensureSpreadsheet();
      
      return;
    }
    
    // Use API key for read-only operations in development
    if (process.env.GOOGLE_API_KEY) {
      sheetsAPI = google.sheets({ 
        version: "v4", 
        auth: process.env.GOOGLE_API_KEY 
      });
      console.log("Google Sheets API initialized with API key (read-only)");
      return;
    }
    
    console.log("No Google Sheets credentials found. Using mock mode for development.");
    
    // Create a mock API for development
    if (process.env.NODE_ENV === 'development') {
      sheetsAPI = {
        spreadsheets: {
          get: async () => ({ data: { sheets: [{ properties: { title: SHEET_NAME } }] } }),
          batchUpdate: async () => ({}),
          values: {
            get: async () => ({ data: { range: '', values: [] } }),
            update: async () => ({ data: { updatedRows: 0 } }),
            clear: async () => ({})
          }
        }
      };
      return;
    } else {
      console.warn("No Google Sheets credentials found. Sheet sync will be disabled.");
    }
  } catch (error) {
    console.error("Failed to initialize Google Sheets API:", error);
    // Don't throw in development to avoid crashing the app
    if (process.env.NODE_ENV !== 'development') {
      throw error;
    }
    console.log("Continuing without Google Sheets integration");
  }
}

async function ensureSpreadsheet() {
  if (!sheetsAPI || !SPREADSHEET_ID) return;
  
  try {
    // Check if sheet exists
    const sheets = await sheetsAPI.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    
    const sheetExists = sheets.data.sheets.some(
      (sheet: any) => sheet.properties.title === SHEET_NAME
    );
    
    if (!sheetExists) {
      // Create the sheet
      await sheetsAPI.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: SHEET_NAME,
                },
              },
            },
          ],
        },
      });
      
      // Add headers
      await sheetsAPI.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:J1`,
        valueInputOption: "RAW",
        resource: {
          values: [
            [
              "ID",
              "Client Name",
              "Drawing Title",
              "Description",
              "Deadline",
              "Amount",
              "Date Created",
              "Completed",
              "Favorite",
              "User ID",
            ],
          ],
        },
      });
      
      console.log(`Sheet "${SHEET_NAME}" created with headers`);
    }
  } catch (error) {
    console.error("Error ensuring spreadsheet exists:", error);
    throw error;
  }
}

export async function syncDrawingsToSheets() {
  if (!sheetsAPI || !SPREADSHEET_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.log("Development mode: skipping Google Sheets sync");
      return { success: true, message: "Development mode", updatedRows: 0 };
    }
    return { success: false, message: "Google Sheets API not initialized", updatedRows: 0 };
  }
  
  try {
    // Get all drawing entries
    const allUsers = await storage.getAllUsers();
    const allEntries = [];
    
    for (const user of allUsers) {
      const userEntries = await storage.getDrawingEntries(user.id);
      allEntries.push(...userEntries);
    }
    
    // Format data for sheets
    const values = allEntries.map(entry => [
      entry.id.toString(),
      entry.clientName,
      entry.drawingTitle,
      entry.drawingDescription || "",
      entry.deadline ? new Date(entry.deadline).toLocaleDateString() : "",
      entry.amount,
      new Date(entry.dateCreated).toLocaleString(),
      entry.completed ? "Yes" : "No",
      entry.favorite ? "Yes" : "No",
      entry.userId.toString()
    ]);
    
    // Add headers
    values.unshift([
      "ID",
      "Client Name",
      "Drawing Title",
      "Description",
      "Deadline",
      "Amount",
      "Date Created",
      "Completed",
      "Favorite",
      "User ID"
    ]);
    
    try {
      // Clear existing data and update
      await sheetsAPI.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
      });
      
      const response = await sheetsAPI.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: "RAW",
        resource: {
          values,
        },
      });
      
      return { success: true, updatedRows: response.data?.updatedRows || 0 };
    } catch (apiError) {
      console.error("Error updating Google Sheets:", apiError);
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: continuing despite Sheets API error");
        return { success: true, message: "Development mode", updatedRows: 0 };
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Error syncing to Google Sheets:", error);
    if (process.env.NODE_ENV === 'development') {
      console.log("Development mode: continuing despite error");
      return { success: true, message: "Development mode", updatedRows: 0 };
    }
    throw error;
  }
}

export async function getSheetsData() {
  if (!sheetsAPI || !SPREADSHEET_ID) {
    return { range: "", values: [] };
  }
  
  try {
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });
    
    return response.data;
  } catch (error) {
    console.error("Error getting Google Sheets data:", error);
    throw error;
  }
}
