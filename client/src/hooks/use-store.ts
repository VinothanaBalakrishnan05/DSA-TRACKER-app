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

export type DayData = {
  tasks: DailyTask[];
  notes: string;
};

export type CoreSubject = {
  id: number;
  name: string;
  progress: number;
  items: { id: string; name: string; completed: boolean }[];
};

export type AppState = {
  topics: StoredTopic[];
  dailyTasks: DailyTask[]; // Legacy
  interviewSubjects: CoreSubject[];
  streak: number;
  lastVisit: string;
  notes: string; // Legacy
  calendarData: Record<string, DayData>;
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

const INITIAL_SUBJECTS: CoreSubject[] = [
  {
    id: 1,
    name: 'Computer Networks',
    progress: 0,
    items: [
      { id: 'cn1', name: 'OSI Model: layers, functions, examples', completed: false },
      { id: 'cn2', name: 'TCP/IP Model: layers, protocols, differences with OSI', completed: false },
      { id: 'cn3', name: 'IP Addressing: IPv4, IPv6, subnetting, CIDR', completed: false },
      { id: 'cn4', name: 'TCP vs UDP: features, reliability, use cases', completed: false },
      { id: 'cn5', name: 'TCP Three-Way Handshake', completed: false },
      { id: 'cn6', name: 'Congestion Control & Flow Control', completed: false },
      { id: 'cn7', name: 'HTTP / HTTPS: request-response flow', completed: false },
      { id: 'cn8', name: 'SSL/TLS basics', completed: false },
      { id: 'cn9', name: 'DNS lookup process', completed: false },
      { id: 'cn10', name: 'Routing basics: static vs dynamic', completed: false },
      { id: 'cn11', name: 'Client-server model & sockets', completed: false },
      { id: 'cn12', name: 'Common scenario questions: e.g., "What happens when you type a URL in browser?"', completed: false },
    ]
  },
  {
    id: 2,
    name: 'Object Oriented Programming',
    progress: 0,
    items: [
      { id: 'oop1', name: 'Classes & Objects: attributes, methods, constructors/destructors', completed: false },
      { id: 'oop2', name: 'Encapsulation', completed: false },
      { id: 'oop3', name: 'Inheritance: types, pros & cons', completed: false },
      { id: 'oop4', name: 'Polymorphism: compile-time (overloading) & runtime (overriding)', completed: false },
      { id: 'oop5', name: 'Abstraction & Interfaces', completed: false },
      { id: 'oop6', name: 'Composition vs Inheritance', completed: false },
      { id: 'oop7', name: 'Memory concepts: Stack vs Heap', completed: false },
      { id: 'oop8', name: 'Basic Design Patterns: Singleton, Factory', completed: false },
      { id: 'oop9', name: 'Scenario-based questions: e.g., "Design a Parking Lot System"', completed: false },
    ]
  },
  {
    id: 3,
    name: 'Database Management Systems (DBMS)',
    progress: 0,
    items: [
      { id: 'db1', name: 'ER Diagrams & Relationships (1:1, 1:N, M:N)', completed: false },
      { id: 'db2', name: 'Normalization: 1NF, 2NF, 3NF, BCNF', completed: false },
      { id: 'db3', name: 'SQL Queries: SELECT, JOINs, GROUP BY, HAVING, subqueries', completed: false },
      { id: 'db4', name: 'Indexing: B-Tree, Hash index, advantages & disadvantages', completed: false },
      { id: 'db5', name: 'Transactions: ACID properties', completed: false },
      { id: 'db6', name: 'Isolation Levels', completed: false },
      { id: 'db7', name: 'Concurrency Control: deadlocks, locks, optimistic vs pessimistic', completed: false },
      { id: 'db8', name: 'Scenario questions: e.g., "Write a query for second highest salary"', completed: false },
    ]
  },
  {
    id: 4,
    name: 'Operating Systems (OS)',
    progress: 0,
    items: [
      { id: 'os1', name: 'Process vs Thread: definitions, life cycle', completed: false },
      { id: 'os2', name: 'CPU Scheduling: FCFS, SJF, Round Robin, Priority', completed: false },
      { id: 'os3', name: 'Context Switching', completed: false },
      { id: 'os4', name: 'Memory Management: Paging, Segmentation, Virtual Memory', completed: false },
      { id: 'os5', name: 'Synchronization: Mutex, Semaphore, Deadlock conditions & prevention', completed: false },
      { id: 'os6', name: 'File Systems: basics, inodes, file storage', completed: false },
      { id: 'os7', name: 'Scenario-based questions: e.g., "Simulate LRU cache", "Explain deadlock with example"', completed: false },
    ]
  }
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
      
      // Ensure calendarData exists
      if (!parsed.calendarData) {
        parsed.calendarData = {};
      }

      // Check for subjects migration
      if (parsed.interviewSubjects[0] && !('items' in parsed.interviewSubjects[0])) {
        parsed.interviewSubjects = INITIAL_SUBJECTS;
      }

      // Migrate legacy notes if needed
      if (parsed.notes && !parsed.calendarData[today]?.notes) {
        parsed.calendarData[today] = {
          ...parsed.calendarData[today],
          notes: parsed.notes,
          tasks: parsed.calendarData[today]?.tasks || parsed.dailyTasks || []
        };
      }
      
      // Check for day reset
      if (parsed.lastVisit !== today) {
        const lastVisitDate = parseISO(parsed.lastVisit);
        const yesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd');
        
        // Calculate streak based on daily task completion
        const yesterdayData = parsed.calendarData?.[yesterday];
        const yesterdayCompleted = yesterdayData && yesterdayData.tasks.length > 0 && yesterdayData.tasks.every(t => t.completed);

        if (yesterdayCompleted) {
          parsed.streak += 1;
        } else {
          // If they missed yesterday, streak resets to 1 (starting today)
          parsed.streak = 1;
        }
        
        // Initialize today if not exists
        if (!parsed.calendarData[today]) {
          // Carry over incomplete tasks or start fresh? User wants to schedule.
          // Let's start with INITIAL_TASKS but allow custom.
          parsed.calendarData[today] = {
            tasks: INITIAL_TASKS.map(t => ({ ...t, date: today })),
            notes: ''
          };
        }
        
        parsed.lastVisit = today;
      }
      
      setState(parsed);
    } else {
      const initial: AppState = {
        topics: INITIAL_TOPICS,
        dailyTasks: INITIAL_TASKS,
        interviewSubjects: INITIAL_SUBJECTS,
        streak: 1,
        lastVisit: today,
        notes: '',
        calendarData: {
          [today]: {
            tasks: INITIAL_TASKS.map(t => ({ ...t, date: today })),
            notes: ''
          }
        }
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
        const completedCount = newSubtopics.filter(st => st.completed).length;
        const progress = Math.round((completedCount / newSubtopics.length) * 100);
        return { ...topic, subtopics: newSubtopics, progress };
      }
      return topic;
    });
    
    setState({ ...state, topics: newTopics });
  };

  const getDayData = (date: string) => {
    if (!state) return { tasks: [], notes: '' };
    return state.calendarData?.[date] || { tasks: [], notes: '' };
  };

  const updateDayData = (date: string, updates: Partial<DayData>) => {
    if (!state) return;
    const currentData = getDayData(date);
    const newState = {
      ...state,
      calendarData: {
        ...state.calendarData,
        [date]: { ...currentData, ...updates }
      }
    };
    setState(newState);
  };

  const addTask = (date: string, text: string) => {
    const current = getDayData(date);
    const newTask: DailyTask = {
      id: Date.now(),
      text,
      completed: false,
      date
    };
    updateDayData(date, { tasks: [...current.tasks, newTask] });
  };

  const toggleDailyTask = (date: string, taskId: number) => {
    const current = getDayData(date);
    const newTasks = current.tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    updateDayData(date, { tasks: newTasks });
  };

  const removeTask = (date: string, taskId: number) => {
    const current = getDayData(date);
    const newTasks = current.tasks.filter(task => task.id !== taskId);
    updateDayData(date, { tasks: newTasks });
  };

  const toggleCoreItem = (subjectId: number, itemId: string) => {
    if (!state) return;
    const newSubjects = state.interviewSubjects.map(sub => {
      if (sub.id === subjectId) {
        const newItems = sub.items.map(item => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const progress = Math.round((newItems.filter(i => i.completed).length / newItems.length) * 100);
        return { ...sub, items: newItems, progress };
      }
      return sub;
    });
    setState({ ...state, interviewSubjects: newSubjects });
  };

  const resetProgress = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const initial: AppState = {
      topics: INITIAL_TOPICS,
      dailyTasks: INITIAL_TASKS,
      interviewSubjects: INITIAL_SUBJECTS,
      streak: 1,
      lastVisit: today,
      notes: '',
      calendarData: {
        [today]: {
          tasks: INITIAL_TASKS.map(t => ({ ...t, date: today })),
          notes: ''
        }
      }
    };
    setState(initial);
  };

  return {
    state,
    isLoading: !state,
    toggleSubtopic,
    toggleDailyTask,
    toggleCoreItem,
    resetProgress,
    getDayData,
    updateDayData,
    addTask,
    removeTask
  };
}
