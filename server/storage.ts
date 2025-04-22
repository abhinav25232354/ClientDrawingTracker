import { users, type User, type InsertUser, drawingEntries, type DrawingEntry, type InsertDrawingEntry } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getDrawingEntries(userId: number): Promise<DrawingEntry[]>;
  getDrawingEntry(id: number): Promise<DrawingEntry | undefined>;
  createDrawingEntry(entry: InsertDrawingEntry): Promise<DrawingEntry>;
  updateDrawingEntry(id: number, updates: Partial<InsertDrawingEntry>): Promise<DrawingEntry>;
  deleteDrawingEntry(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private drawingEntries: Map<number, DrawingEntry>;
  private userId: number;
  private entryId: number;

  constructor() {
    this.users = new Map();
    this.drawingEntries = new Map();
    this.userId = 1;
    this.entryId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getDrawingEntries(userId: number): Promise<DrawingEntry[]> {
    return Array.from(this.drawingEntries.values())
      .filter(entry => entry.userId === userId);
  }
  
  async getDrawingEntry(id: number): Promise<DrawingEntry | undefined> {
    return this.drawingEntries.get(id);
  }
  
  async createDrawingEntry(insertEntry: InsertDrawingEntry): Promise<DrawingEntry> {
    const id = this.entryId++;
    const now = new Date();
    const entry: DrawingEntry = { 
      ...insertEntry, 
      id,
      dateCreated: now 
    };
    this.drawingEntries.set(id, entry);
    return entry;
  }
  
  async updateDrawingEntry(id: number, updates: Partial<InsertDrawingEntry>): Promise<DrawingEntry> {
    const entry = this.drawingEntries.get(id);
    if (!entry) {
      throw new Error(`Drawing entry with id ${id} not found`);
    }
    
    const updatedEntry = { ...entry, ...updates };
    this.drawingEntries.set(id, updatedEntry);
    return updatedEntry;
  }
  
  async deleteDrawingEntry(id: number): Promise<void> {
    if (!this.drawingEntries.has(id)) {
      throw new Error(`Drawing entry with id ${id} not found`);
    }
    
    this.drawingEntries.delete(id);
  }
}

export const storage = new MemStorage();
