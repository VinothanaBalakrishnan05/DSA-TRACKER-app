import { useState, useEffect } from "react";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { format, isSameDay } from "date-fns";
import { Check, Edit3, Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function DailyTracker() {
  const { 
    state, 
    isLoading, 
    getDayData, 
    updateDayData, 
    toggleDailyTask, 
    addTask, 
    removeTask 
  } = useStore();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newTaskText, setNewTaskText] = useState("");
  
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const dayData = getDayData(dateKey);
  const dailyTasks = dayData.tasks;
  const allCompleted = dailyTasks.length > 0 && dailyTasks.every(t => t.completed);

  useEffect(() => {
    if (allCompleted && dailyTasks.length > 0 && isSameDay(selectedDate, new Date())) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#aaaaaa', '#555555']
      });
    }
  }, [allCompleted, dailyTasks, selectedDate]);

  if (isLoading || !state) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(dateKey, newTaskText.trim());
    setNewTaskText("");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <PageHeader 
            title="Daily Routine" 
            description="Manage your schedule and track daily progress."
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-zinc-900 border-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-zinc-300">
                  <CalendarIcon className="w-4 h-4" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-white/10" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="bg-zinc-950 text-white"
                />
              </PopoverContent>
            </Popover>
          </PageHeader>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Tasks</h2>
                {allCompleted && dailyTasks.length > 0 && (
                  <span className="text-green-500 text-sm font-bold animate-pulse">All Done! 🎉</span>
                )}
              </div>

              <form onSubmit={handleAddTask} className="flex gap-2">
                <Input
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Add a new task..."
                  className="bg-zinc-900/50 border-white/10 focus-visible:ring-primary/50 text-white"
                />
                <Button type="submit" size="icon" className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </form>
              
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {dailyTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`
                        relative group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300
                        ${task.completed 
                          ? "bg-primary/5 border-primary/20" 
                          : "glass-card hover:bg-white/5 hover:border-white/10"
                        }
                      `}
                    >
                      <div 
                        onClick={() => toggleDailyTask(dateKey, task.id)}
                        className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors duration-300
                          ${task.completed ? "bg-primary border-primary" : "border-zinc-600 group-hover:border-zinc-400"}
                        `}
                      >
                        {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span 
                        onClick={() => toggleDailyTask(dateKey, task.id)}
                        className={`flex-1 text-base font-medium cursor-pointer transition-all ${task.completed ? "text-zinc-500 line-through" : "text-zinc-200"}`}
                      >
                        {task.text}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTask(dateKey, task.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {dailyTasks.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                    <p className="text-zinc-500">No tasks for this day yet.</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 h-full flex flex-col"
            >
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-zinc-400" />
                <h2 className="text-xl font-semibold text-white">Daily Notes</h2>
              </div>
              
              <div className="flex-1 glass-card p-1 rounded-2xl">
                <Textarea 
                  value={dayData.notes}
                  onChange={(e) => updateDayData(dateKey, { notes: e.target.value })}
                  placeholder="Jot down what you learned today..."
                  className="w-full h-full min-h-[300px] bg-transparent border-none resize-none focus-visible:ring-0 text-zinc-300 placeholder:text-zinc-600 p-4 leading-relaxed text-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
