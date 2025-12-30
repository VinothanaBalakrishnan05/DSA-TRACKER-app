import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "../shared/db";
import { jobApplications, interviewRounds } from "../shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get all job applications with their rounds
  app.get("/api/job-applications", async (req, res) => {
    try {
      const apps = await db.select().from(jobApplications);
      const rounds = await db.select().from(interviewRounds);

      const appsWithRounds = apps.map(app => ({
        ...app,
        rounds: rounds.filter(r => r.applicationId === app.id)
      }));

      res.json(appsWithRounds);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  });

  // Create new job application
  app.post("/api/job-applications", async (req, res) => {
    try {
      const { id, companyName, applicationStatus, review, rounds } = req.body;
      const now = new Date().toISOString();

      await db.insert(jobApplications).values({
        id,
        companyName,
        applicationStatus: applicationStatus || 'pending',
        review: review || '',
        createdAt: now,
        updatedAt: now
      });

      if (rounds && rounds.length > 0) {
        await db.insert(interviewRounds).values(
          rounds.map((round: any) => ({
            ...round,
            createdAt: now,
            updatedAt: now
          }))
        );
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error creating application:', error);
      res.status(500).json({ error: 'Failed to create application' });
    }
  });

  // Update job application
  app.patch("/api/job-applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      await db.update(jobApplications)
        .set({ ...updates, updatedAt: new Date().toISOString() })
        .where(eq(jobApplications.id, id));

      res.json({ success: true });
    } catch (error) {
      console.error('Error updating application:', error);
      res.status(500).json({ error: 'Failed to update application' });
    }
  });

  // Delete job application
  app.delete("/api/job-applications/:id", async (req, res) => {
    try {
      const { id } = req.params;

      await db.delete(interviewRounds).where(eq(interviewRounds.applicationId, id));
      await db.delete(jobApplications).where(eq(jobApplications.id, id));

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(500).json({ error: 'Failed to delete application' });
    }
  });

  // Create interview round
  app.post("/api/interview-rounds", async (req, res) => {
    try {
      const round = req.body;
      const now = new Date().toISOString();

      await db.insert(interviewRounds).values({
        ...round,
        createdAt: now,
        updatedAt: now
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Error creating round:', error);
      res.status(500).json({ error: 'Failed to create round' });
    }
  });

  // Update interview round
  app.patch("/api/interview-rounds/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      await db.update(interviewRounds)
        .set({ ...updates, updatedAt: new Date().toISOString() })
        .where(eq(interviewRounds.id, id));

      res.json({ success: true });
    } catch (error) {
      console.error('Error updating round:', error);
      res.status(500).json({ error: 'Failed to update round' });
    }
  });

  // Delete interview round
  app.delete("/api/interview-rounds/:id", async (req, res) => {
    try {
      const { id } = req.params;

      await db.delete(interviewRounds).where(eq(interviewRounds.id, id));

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting round:', error);
      res.status(500).json({ error: 'Failed to delete round' });
    }
  });

  return httpServer;
}
