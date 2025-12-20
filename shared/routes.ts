import { z } from 'zod';
import { insertTopicSchema, insertDailyTaskSchema, insertInterviewSubjectSchema } from './schema';

export const api = {}; // No backend routes needed as per requirements

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  return path;
}
