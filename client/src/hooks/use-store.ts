import { useState, useEffect } from 'react';
import { type Topic, type DailyTask, type InterviewSubject } from '@shared/schema';
import { addDays, differenceInCalendarDays, format, isSameDay, parseISO } from 'date-fns';

// Types derived from schema, tailored for JSON usage in LocalStorage
export type SubTopic = {
  id: string;
  name: string;
  completed: boolean;
};

export type StoredTopic = Omit<Topic, 'subtopics'> & {
  subtopics: SubTopic[];
};

export type AppState = {
  topics: StoredTopic[];
  dailyTasks: DailyTask[];
  interviewSubjects: InterviewSubject[];
  streak: number;
  lastVisit: string;
  notes: string;
};

const INITIAL_TOPICS: StoredTopic[] = [
  {
    id: 1, name: 'Sorting', slug: 'sorting', progress: 0, category: 'DSA',
    subtopics: [
      { id: 's1', name: 'Bubble Sort', completed: false },
      { id: 's2', name: 'Selection Sort', completed: false },
      { id: 's3', name: 'Insertion Sort', completed: false },
      { id: 's4', name: 'Merge Sort', completed: false },
      { id: 's5', name: 'Quick Sort', completed: false },
      { id: 's6', name: 'Heap Sort', completed: false },
    ]
  },
  {
    id: 2, name: 'Binary Search', slug: 'binary-search', progress: 0, category: 'DSA',
    subtopics: [
      { id: 'bs1', name: 'Iterative Implementation', completed: false },
      { id: 'bs2', name: 'Recursive Implementation', completed: false },
      { id: 'bs3', name: 'Lower Bound', completed: false },
      { id: 'bs4', name: 'Upper Bound', completed: false },
    ]
  },
  {
    id: 3, name: 'Recursion', slug: 'recursion', progress: 0, category: 'DSA',
    subtopics: [
      { id: 'r1', name: 'Basic Recursion', completed: false },
      { id: 'r2', name: 'Backtracking', completed: false },
    ]
  },
  {
    id: 4, name: 'Linked List', slug: 'linked-list', progress: 0, category: 'DSA',
    subtopics: [
      { id: 'll1', name: 'Singly Linked List', completed: false },
      { id: 'll2', name: 'Doubly Linked List', completed: false },
      { id: 'll3', name: 'Circular Linked List', completed: false },
    ]
  },
  {
    id: 5, name: 'Stack & Queue', slug: 'stack-queue', progress: 0, category: 'DSA',
    subtopics: [
      { id: 'sq1', name: 'Stack using Array', completed: false },
      { id: 'sq2', name: 'Queue using Array', completed: false },
      { id: 'sq3', name: 'Stack using Linked List', completed: false },
    ]
  },
  {
    id: 6, name: 'Trees', slug: 'trees', progress: 0, category: 'DSA',
    subtopics: [
      { id: 't1', name: 'Traversals (In/Pre/Post)', completed: false },
      { id: 't2', name: 'Binary Search Tree', completed: false },
      { id: 't3', name: 'AVL Trees', completed: false },
    ]
  },
  {
    id: 7, name: 'Heaps', slug: 'heaps', progress: 0, category: 'DSA',
    subtopics: [
      { id: 'h1', name: 'Min Heap', completed: false },
      { id: 'h2', name: 'Max Heap', completed: false },
      { id: 'h3', name: 'Priority Queue', completed: false },
    ]
  },
  {
    id: 8, name: 'Hashing', slug: 'hashing', progress: 0, category: 'DSA',
    subtopics: [
      { id: 'ha1', name: 'HashMap Basics', completed: false },
      { id: 'ha2', name: 'HashSet Basics', completed: false },
      { id: 'ha3', name: 'Collision Handling', completed: false },
    ]
  },
  {
    id: 9, name: 'Dynamic Programming', slug: 'dp', progress: 0, category: 'DSA',
    subtopics: [
      { id: 'dp1', name: '1D DP (Climbing Stairs)', completed: false },
      { id: 'dp2', name: '2D DP (Grid Paths)', completed: false },
      { id: 'dp3', name: '0/1 Knapsack', completed: false },
    ]
  },
  {
    id: 10, name: 'Arrays', slug: 'arrays', progress: 0, category: 'DSA',
    subtopics: [
      { id: 'a1', name: 'Array Basics', completed: false },
      { id: 'a2', name: '2D Arrays', completed: false },
      { id: 'a3', name: 'Sliding Window', completed: false },
    ]
  }
];

const INITIAL_TASKS: DailyTask[] = [
  { id: 1, text: 'Solve 1 LeetCode Easy', completed: false, date: format(new Date(), 'yyyy-MM-dd') },
  { id: 2, text: "Review yesterday's problem", completed: false, date: format(new Date(), 'yyyy-MM-dd') },
  { id: 3, text: 'Read 1 System Design article', completed: false, date: format(new Date(), 'yyyy-MM-dd') },
];

const INITIAL_SUBJECTS: InterviewSubject[] = [
  { id: 1, name: 'Operating Systems', progress: 20, confidence: 2 },
  { id: 2, name: 'DBMS', progress: 40, confidence: 3 },
  { id: 3, name: 'Computer Networks', progress: 10, confidence: 1 },
  { id: 4, name: 'Object Oriented Programming', progress: 80, confidence: 5 },
  { id: 5, name: 'System Design', progress: 0, confidence: 1 },
];

const STORAGE_KEY = 'dev-tracker-v1';

export function useStore() {
  const [state, setState] = useState<AppState | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (saved) {
      const parsed: AppState = JSON.parse(saved);
      
      // Check for day reset
      if (parsed.lastVisit !== today) {
        // It's a new day
        const lastVisitDate = parseISO(parsed.lastVisit);
        const diff = differenceInCalendarDays(new Date(), lastVisitDate);
        
        // Update streak logic
        if (diff === 1) {
          parsed.streak += 1;
        } else if (diff > 1) {
          parsed.streak = 1; // Streak broken
        }
        
        // Reset daily tasks
        parsed.dailyTasks = INITIAL_TASKS.map(t => ({ ...t, date: today }));
        parsed.lastVisit = today;
      }
      
      setState(parsed);
    } else {
      // First visit initialization
      const initial: AppState = {
        topics: INITIAL_TOPICS,
        dailyTasks: INITIAL_TASKS,
        interviewSubjects: INITIAL_SUBJECTS,
        streak: 1,
        lastVisit: today,
        notes: ''
      };
      setState(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const toggleSubtopic = (topicId: number, subtopicId: string) => {
    if (!state) return;
    
    const newTopics = state.topics.map(topic => {
      if (topic.id === topicId) {
        const newSubtopics = topic.subtopics.map(st => 
          st.id === subtopicId ? { ...st, completed: !st.completed } : st
        );
        
        // Recalculate progress
        const completedCount = newSubtopics.filter(st => st.completed).length;
        const progress = Math.round((completedCount / newSubtopics.length) * 100);
        
        return { ...topic, subtopics: newSubtopics, progress };
      }
      return topic;
    });
    
    setState({ ...state, topics: newTopics });
  };

  const toggleDailyTask = (taskId: number) => {
    if (!state) return;
    const newTasks = state.dailyTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setState({ ...state, dailyTasks: newTasks });
  };

  const updateSubject = (id: number, updates: Partial<InterviewSubject>) => {
    if (!state) return;
    const newSubjects = state.interviewSubjects.map(sub => 
      sub.id === id ? { ...sub, ...updates } : sub
    );
    setState({ ...state, interviewSubjects: newSubjects });
  };

  const updateNotes = (notes: string) => {
    if (!state) return;
    setState({ ...state, notes });
  };

  const resetProgress = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const initial: AppState = {
      topics: INITIAL_TOPICS,
      dailyTasks: INITIAL_TASKS,
      interviewSubjects: INITIAL_SUBJECTS,
      streak: 1,
      lastVisit: today,
      notes: ''
    };
    setState(initial);
  };

  return {
    state,
    isLoading: !state,
    toggleSubtopic,
    toggleDailyTask,
    updateSubject,
    updateNotes,
    resetProgress
  };
}
