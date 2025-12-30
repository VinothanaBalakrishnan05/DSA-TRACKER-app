import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We are using LocalStorage, but defining schema here for type sharing
// and potential future backend sync.

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // for matching "sorting", "binary-search"
  progress: integer("progress").default(0),
  subtopics: jsonb("subtopics").$type<{id: string, name: string, completed: boolean}[]>().notNull(),
  category: text("category").notNull(), // "DSA"
});

export const dailyTasks = pgTable("daily_tasks", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  completed: boolean("completed").default(false),
  date: text("date").notNull(), // ISO date string
});

export const interviewSubjects = pgTable("interview_subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  progress: integer("progress").default(0),
  confidence: integer("confidence").default(1), // 1-5
});

// Zod Schemas
export const insertTopicSchema = createInsertSchema(topics);
export const insertDailyTaskSchema = createInsertSchema(dailyTasks);
export const insertInterviewSubjectSchema = createInsertSchema(interviewSubjects);

export type Topic = typeof topics.$inferSelect;
export type DailyTask = typeof dailyTasks.$inferSelect;
export type InterviewSubject = typeof interviewSubjects.$inferSelect;

// Job Applications Tracker
export const jobApplications = pgTable("job_applications", {
  id: text("id").primaryKey(),
  companyName: text("company_name").notNull(),
  applicationStatus: text("application_status").notNull().$type<'pending' | 'accepted' | 'rejected'>().default('pending'),
  review: text("review"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const interviewRounds = pgTable("interview_rounds", {
  id: text("id").primaryKey(),
  applicationId: text("application_id").notNull(),
  roundName: text("round_name").notNull(),
  roundNumber: integer("round_number").notNull(),
  status: text("status").notNull().$type<'pending' | 'accepted' | 'rejected'>().default('pending'),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications);
export const insertInterviewRoundSchema = createInsertSchema(interviewRounds);

export type JobApplication = typeof jobApplications.$inferSelect;
export type InterviewRound = typeof interviewRounds.$inferSelect;

// App State for LocalStorage
export type AppState = {
  topics: Topic[];
  dailyTasks: DailyTask[];
  interviewSubjects: InterviewSubject[];
  streak: number;
  lastVisit: string; // Date string
};
