import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),
  isAdmin: boolean("is_admin").default(false),
});

export const drawingEntries = pgTable("drawing_entries", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  drawingTitle: text("drawing_title").notNull(),
  drawingDescription: text("drawing_description"),
  deadline: date("deadline"),
  amount: text("amount").notNull(),
  dateCreated: timestamp("date_created").notNull().defaultNow(),
  completed: boolean("completed").default(false),
  favorite: boolean("favorite").default(false),
  userId: integer("user_id").notNull().references(() => users.id),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  avatarUrl: true,
  isAdmin: true,
});

export const insertDrawingEntrySchema = createInsertSchema(drawingEntries).pick({
  clientName: true,
  drawingTitle: true,
  drawingDescription: true,
  deadline: true,
  amount: true,
  completed: true,
  favorite: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDrawingEntry = z.infer<typeof insertDrawingEntrySchema>;
export type DrawingEntry = typeof drawingEntries.$inferSelect;
