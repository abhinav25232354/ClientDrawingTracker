import { Express } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";

export function initializePassport(app: Express) {
  // Check if Google OAuth credentials are available
  const hasGoogleCredentials = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
  
  if (hasGoogleCredentials) {
    // Google OAuth Strategy
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/api/auth/google/callback",
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in profile"), null);
        }
        
        let user = await storage.getUserByEmail(email);
        
        // Create user if they don't exist
        if (!user) {
          const newUser = {
            username: profile.displayName || email.split("@")[0],
            password: Math.random().toString(36).slice(-8), // Random password as Google auth is used
            email,
            avatarUrl: profile.photos?.[0]?.value,
            isAdmin: true // For simplicity, all Google-authenticated users are admins
          };
          
          user = await storage.createUser(newUser);
        }
        
        return done(null, {
          id: user.id,
          email: user.email,
          name: user.username,
          avatarUrl: user.avatarUrl,
          isAdmin: user.isAdmin
        });
      } catch (error) {
        return done(error, null);
      }
    }));
  } else {
    console.log("Google OAuth credentials not found. Creating demo user for development.");
    
    // Create a demo user
    (async () => {
      try {
        const demoEmail = "demo@example.com";
        let demoUser = await storage.getUserByEmail(demoEmail);
        
        if (!demoUser) {
          demoUser = await storage.createUser({
            username: "Demo User",
            password: "demopassword",
            email: demoEmail,
            isAdmin: true
          });
          console.log("Created demo user:", demoUser);
        }
      } catch (error) {
        console.error("Error creating demo user:", error);
      }
    })();
  }
  
  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  // Deserialize user from session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}
