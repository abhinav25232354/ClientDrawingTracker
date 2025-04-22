import { apiRequest } from "@/lib/queryClient";
import { SheetsData } from "@/lib/types";

export async function syncWithGoogleSheets() {
  try {
    const response = await apiRequest("POST", "/api/sheets/sync", {});
    return await response.json();
  } catch (error) {
    console.error("Failed to sync with Google Sheets:", error);
    throw error;
  }
}

export async function getSheetsData(): Promise<SheetsData> {
  try {
    const response = await apiRequest("GET", "/api/sheets/data", {});
    return await response.json();
  } catch (error) {
    console.error("Failed to get Google Sheets data:", error);
    throw error;
  }
}
