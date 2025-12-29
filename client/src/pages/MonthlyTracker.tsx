import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function MonthlyTracker() {
  const { getDayData, addTask, removeTask, toggleDailyTask, isLoading } = useStore();
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState("");
  
  if (isLoading) return null;

  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });

  const handleAddTask = (dateKey: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(dateKey, newTaskText.trim());
    setNewTaskText("");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <PageHeader 
            title="Monthly Tracker" 
            description={`Plan your month and track overall progress for ${format(today, "MMMM yyyy")}.`} 
          />

          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-lg overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="bg-zinc-950 p-2 text-center text-xs font-bold text-zinc-500 uppercase">
                  {d}
                </div>
              ))}
              
              {Array.from({ length: start.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-zinc-950/50 min-h-[120px]" />
              ))}

              {days.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const data = getDayData(dateKey);
                const completedCount = data.tasks.filter(t => t.completed).length;
                const totalCount = data.tasks.length;
                const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                return (
                  <Popover key={dateKey}>
                    <PopoverTrigger asChild>
                      <button 
                        className={cn(
                          "bg-zinc-950 p-2 min-h-[120px] border-white/5 flex flex-col gap-1 transition-all hover:bg-white/5 text-left relative group",
                          isToday(day) && "bg-primary/5 ring-1 ring-primary/50 z-10"
                        )}
                      >
                        <span className={cn(
                          "text-sm font-medium",
                          isToday(day) ? "text-primary" : "text-zinc-500"
                        )}>
                          {format(day, "d")}
                        </span>
                        
                        {totalCount > 0 ? (
                          <div className="flex-1 flex flex-col gap-1 mt-1">
                            <div className="text-[10px] text-zinc-400 font-medium truncate">
                              {completedCount}/{totalCount} tasks
                            </div>
                            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-primary h-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="mt-1 flex flex-col gap-1">
                              {data.tasks.slice(0, 2).map(t => (
                                <div key={t.id} className="text-[9px] text-zinc-500 truncate flex items-center gap-1">
                                  <div className={cn("w-1 h-1 rounded-full", t.completed ? "bg-green-500" : "bg-zinc-700")} />
                                  <span className={t.completed ? "line-through opacity-50" : ""}>{t.text}</span>
                                </div>
                              ))}
                              {totalCount > 2 && <span className="text-[9px] text-zinc-600">+{totalCount - 2} more</span>}
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-4 h-4 text-zinc-700" />
                          </div>
                        )}
                        
                        {data.notes && (
                          <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-primary" />
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-zinc-950 border-white/10 p-4 shadow-2xl" side="right">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-white">{format(day, "MMMM do")}</h4>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {Math.round(progress)}% Done
                          </span>
                        </div>

                        <form onSubmit={(e) => handleAddTask(dateKey, e)} className="flex gap-2">
                          <Input
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="Add task..."
                            className="h-8 text-xs bg-zinc-900 border-white/10 text-white"
                          />
                          <Button type="submit" size="icon" className="h-8 w-8">
                            <Plus className="w-3 h-3" />
                          </Button>
                        </form>

                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                          <AnimatePresence mode="popLayout">
                            {data.tasks.map((task) => (
                              <motion.div 
                                key={task.id} 
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2 text-xs group"
                              >
                                <div 
                                  onClick={() => toggleDailyTask(dateKey, task.id)}
                                  className="cursor-pointer"
                                >
                                  {task.completed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                  ) : (
                                    <Circle className="w-3.5 h-3.5 text-zinc-600" />
                                  )}
                                </div>
                                <span className={cn("flex-1", task.completed && "text-zinc-500 line-through")}>
                                  {task.text}
                                </span>
                                <button
                                  onClick={() => removeTask(dateKey, task.id)}
                                  className="text-zinc-600 hover:text-red-500"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
