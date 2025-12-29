import { Link } from "wouter";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { CircularProgress } from "@/components/CircularProgress";
import { format } from "date-fns";
import { Flame, Trophy, TrendingUp, CheckCircle2, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

const MOTIVATIONAL_QUOTES = [
  { quote: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { quote: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { quote: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { quote: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
  { quote: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { quote: "Don't comment bad code - rewrite it.", author: "Brian Kernighan" },
  { quote: "Consistency is what transforms average into excellence.", author: "Unknown" },
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { quote: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" }
];

export default function Dashboard() {
  const { state, isLoading, getDayData } = useStore();
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setQuote(MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length]);
  }, []);

  if (isLoading || !state) return null;

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayData = getDayData(today);
  const dailyTasks = todayData.tasks;
  const totalSubtopics = state.topics.reduce((acc, t) => acc + t.subtopics.length, 0);
  const completedSubtopics = state.topics.reduce((acc, t) => acc + t.subtopics.filter(s => s.completed).length, 0);
  const totalProgress = Math.round((completedSubtopics / totalSubtopics) * 100) || 0;

  // Calculate core subjects progress
  const totalCoreItems = state.interviewSubjects.reduce((acc, s) => acc + s.items.length, 0);
  const completedCoreItems = state.interviewSubjects.reduce((acc, s) => acc + s.items.filter(i => i.completed).length, 0);
  const coreProgress = Math.round((completedCoreItems / totalCoreItems) * 100) || 0;

  const stats = [
    {
      label: "Current Streak",
      value: `${state.streak} Days`,
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      desc: "Keep it up!"
    },
    {
      label: "DSA Progress",
      value: `${completedSubtopics}/${totalSubtopics}`,
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      desc: "Topics learned"
    },
    {
      label: "Core Readiness",
      value: `${coreProgress}%`,
      icon: Trophy,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      desc: "Subjects covered"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <PageHeader 
            title="Dashboard" 
            description="Welcome back, Developer. Here's your progress overview." 
          />

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 border border-primary/10 bg-primary/5"
          >
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Quote className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-zinc-200 text-lg font-medium italic">"{quote.quote}"</p>
                <p className="text-zinc-500 text-sm mt-1">— {quote.author}</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm font-medium mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    <p className="text-xs text-zinc-500 mt-2">{stat.desc}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Progress Circle */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center col-span-1"
            >
              <h3 className="text-xl font-semibold mb-6">Total Completion</h3>
              <CircularProgress percentage={totalProgress} size={180} strokeWidth={12} color="#ffffff" />
              <p className="mt-6 text-zinc-400 text-sm max-w-[200px]">
                You've completed {totalProgress}% of your entire learning roadmap.
              </p>
            </motion.div>

            {/* Topic Progress Bars */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6 col-span-1 lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Topic Breakdown</h3>
                <Link href="/dsa" className="text-sm text-zinc-400 hover:text-white transition-colors">View All</Link>
              </div>
              
              <div className="space-y-5 max-h-[300px] overflow-y-auto scrollbar-hide pr-2">
                {state.topics.map((topic) => (
                  <div key={topic.id} className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">{topic.name}</span>
                      <span className="text-zinc-500">{topic.progress}%</span>
                    </div>
                    <Progress value={topic.progress} className="h-2 bg-zinc-800" indicatorClassName="bg-white" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions / Daily Tasks Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6"
          >
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Today's Focus</h3>
                <Link href="/daily" className="text-sm text-primary hover:underline">Go to Tracker</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dailyTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${task.completed ? 'bg-green-500 border-green-500' : 'border-zinc-600'}`}>
                      {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                      {task.text}
                    </span>
                  </div>
                ))}
                {dailyTasks.length === 0 && (
                  <div className="col-span-full py-4 text-center text-zinc-500 text-sm italic">
                    No tasks scheduled for today.
                  </div>
                )}
              </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
