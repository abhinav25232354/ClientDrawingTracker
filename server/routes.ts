import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import session from "express-session";
import MemoryStore from "memorystore";
import { z } from "zod";
import { storage } from "./storage";
import { initializePassport } from "./auth";
import { initializeSheetsAPI, syncDrawingsToSheets, getSheetsData } from "./sheets";
import { insertDrawingEntrySchema, insertUserSchema } from "@shared/schema";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Google OAuth
  initializePassport(app);
  
  // Initialize session
  app.use(session({
    secret: process.env.SESSION_SECRET || "drawtrack-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 },
    store: new SessionStore({
      checkPeriod: 86400000 // 24 hours
    })
  }));
  
  // Initialize passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Initialize Google Sheets API
  await initializeSheetsAPI();
  
  // Authentication Routes
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get('/api/auth/google', 
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );
    
    app.get('/api/auth/google/callback', 
      passport.authenticate('google', { failureRedirect: '/' }),
      (req, res) => {
        res.send(`
          <script>
            window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
            window.close();
          </script>
        `);
      }
    );
  } else {
    // Development auto-login route
    app.get('/api/auth/dev-login', async (req, res) => {
      try {
        const demoEmail = "demo@example.com";
        const demoUser = await storage.getUserByEmail(demoEmail);
        
        if (demoUser) {
          req.login({
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.username,
            isAdmin: demoUser.isAdmin
          }, (err) => {
            if (err) {
              return res.status(500).json({ message: "Failed to login" });
            }
            return res.json({ success: true });
          });
        } else {
          res.status(404).json({ message: "Demo user not found" });
        }
      } catch (error) {
        console.error('Dev login error:', error);
        res.status(500).json({ message: "Failed to login" });
      }
    });
  }
  
  app.get('/api/auth/current-user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = req.user as { id: number, email: string, name: string, avatarUrl?: string, isAdmin: boolean };
    res.json(user);
  });
  
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });
  
  // Authentication middleware for protected routes
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };
  
  // Drawing Entry Routes
  app.get('/api/drawings', requireAuth, async (req, res) => {
    try {
      const userId = (req.user as { id: number }).id;
      const entries = await storage.getDrawingEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error('Failed to get drawings:', error);
      res.status(500).json({ message: "Failed to fetch drawings" });
    }
  });
  
  app.post('/api/drawings', requireAuth, async (req, res) => {
    try {
      const userId = (req.user as { id: number }).id;
      const validatedData = insertDrawingEntrySchema.parse({
        ...req.body,
        userId
      });
      
      const entry = await storage.createDrawingEntry(validatedData);
      
      // Sync to Google Sheets
      await syncDrawingsToSheets();
      
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid entry data", errors: error.errors });
      }
      console.error('Failed to create drawing:', error);
      res.status(500).json({ message: "Failed to create drawing entry" });
    }
  });
  
  app.patch('/api/drawings/:id', requireAuth, async (req, res) => {
    try {
      const drawingId = parseInt(req.params.id);
      const userId = (req.user as { id: number }).id;
      
      // Check if the drawing belongs to the user
      const existingDrawing = await storage.getDrawingEntry(drawingId);
      if (!existingDrawing || existingDrawing.userId !== userId) {
        return res.status(404).json({ message: "Drawing entry not found" });
      }
      
      const updatedEntry = await storage.updateDrawingEntry(drawingId, req.body);
      
      // Sync to Google Sheets
      await syncDrawingsToSheets();
      
      res.json(updatedEntry);
    } catch (error) {
      console.error('Failed to update drawing:', error);
      res.status(500).json({ message: "Failed to update drawing entry" });
    }
  });
  
  app.delete('/api/drawings/:id', requireAuth, async (req, res) => {
    try {
      const drawingId = parseInt(req.params.id);
      const userId = (req.user as { id: number }).id;
      
      // Check if the drawing belongs to the user
      const existingDrawing = await storage.getDrawingEntry(drawingId);
      if (!existingDrawing || existingDrawing.userId !== userId) {
        return res.status(404).json({ message: "Drawing entry not found" });
      }
      
      await storage.deleteDrawingEntry(drawingId);
      
      // Sync to Google Sheets
      await syncDrawingsToSheets();
      
      res.json({ success: true });
    } catch (error) {
      console.error('Failed to delete drawing:', error);
      res.status(500).json({ message: "Failed to delete drawing entry" });
    }
  });
  
  app.patch('/api/drawings/:id/favorite', requireAuth, async (req, res) => {
    try {
      const drawingId = parseInt(req.params.id);
      const userId = (req.user as { id: number }).id;
      const favorite = req.body.favorite === true;
      
      // Check if the drawing belongs to the user
      const existingDrawing = await storage.getDrawingEntry(drawingId);
      if (!existingDrawing || existingDrawing.userId !== userId) {
        return res.status(404).json({ message: "Drawing entry not found" });
      }
      
      const updatedEntry = await storage.updateDrawingEntry(drawingId, { favorite });
      
      // Sync to Google Sheets
      await syncDrawingsToSheets();
      
      res.json(updatedEntry);
    } catch (error) {
      console.error('Failed to update favorite status:', error);
      res.status(500).json({ message: "Failed to update favorite status" });
    }
  });
  
  app.patch('/api/drawings/:id/complete', requireAuth, async (req, res) => {
    try {
      const drawingId = parseInt(req.params.id);
      const userId = (req.user as { id: number }).id;
      const completed = req.body.completed === true;
      
      // Check if the drawing belongs to the user
      const existingDrawing = await storage.getDrawingEntry(drawingId);
      if (!existingDrawing || existingDrawing.userId !== userId) {
        return res.status(404).json({ message: "Drawing entry not found" });
      }
      
      const updatedEntry = await storage.updateDrawingEntry(drawingId, { completed });
      
      // Sync to Google Sheets
      await syncDrawingsToSheets();
      
      res.json(updatedEntry);
    } catch (error) {
      console.error('Failed to update completion status:', error);
      res.status(500).json({ message: "Failed to update completion status" });
    }
  });
  
  // Google Sheets integration routes
  app.post('/api/sheets/sync', requireAuth, async (req, res) => {
    try {
      const result = await syncDrawingsToSheets();
      res.json({ success: true, rowsUpdated: result.updatedRows });
    } catch (error) {
      console.error('Failed to sync with Google Sheets:', error);
      res.status(500).json({ message: "Failed to sync with Google Sheets" });
    }
  });
  
  app.get('/api/sheets/data', requireAuth, async (req, res) => {
    try {
      const data = await getSheetsData();
      res.json(data);
    } catch (error) {
      console.error('Failed to get Google Sheets data:', error);
      res.status(500).json({ message: "Failed to get Google Sheets data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
