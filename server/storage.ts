import { type Topic, type DailyTask, type InterviewSubject } from "@shared/schema";

export interface IStorage {
  // We don't strictly need methods here since frontend uses LocalStorage
  // but we keep the interface for structure
}

export class MemStorage implements IStorage {
  constructor() {
    // No-op
  }
}

export const storage = new MemStorage();
