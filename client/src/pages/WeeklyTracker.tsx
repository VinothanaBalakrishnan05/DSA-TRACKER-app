import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function WeeklyTracker() {
  const { getDayData, addTask, removeTask, toggleDailyTask, isLoading } = useStore();
  const [newTasks, setNewTasks] = useState<Record<string, string>>({});
  
  if (isLoading) return null;

  const start = startOfWeek(new Date());
  const end = endOfWeek(new Date());
  const days = eachDayOfInterval({ start, end });

  const handleAddTask = (dateKey: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = newTasks[dateKey];
    if (!text?.trim()) return;
    addTask(dateKey, text.trim());
    setNewTasks(prev => ({ ...prev, [dateKey]: "" }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <PageHeader 
            title="Weekly Tracker" 
            description="Schedule your week and track your progress." 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {days.map((day, i) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const data = getDayData(dateKey);
              const completed = data.tasks.filter(t => t.completed).length;
              const total = data.tasks.length;
              const progress = total > 0 ? (completed / total) * 100 : 0;
              
              return (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="glass-card border-white/10 h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold flex justify-between items-center text-white">
                        <div className="flex flex-col">
                          <span>{format(day, "EEEE")}</span>
                          <span className="text-xs text-zinc-500">{format(day, "MMM do")}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
                        </div>
                      </CardTitle>
                      <Progress value={progress} className="h-1 bg-zinc-800" indicatorClassName="bg-primary" />
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      <form onSubmit={(e) => handleAddTask(dateKey, e)} className="flex gap-2">
                        <Input
                          value={newTasks[dateKey] || ""}
                          onChange={(e) => setNewTasks(prev => ({ ...prev, [dateKey]: e.target.value }))}
                          placeholder="Quick add..."
                          className="h-8 text-xs bg-zinc-900/50 border-white/10 text-white"
                        />
                        <Button type="submit" size="icon" className="h-8 w-8 shrink-0">
                          <Plus className="w-3 h-3" />
                        </Button>
                      </form>

                      <div className="space-y-2 flex-1">
                        <AnimatePresence mode="popLayout">
                          {data.tasks.map((task) => (
                            <motion.div 
                              key={task.id} 
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2 text-sm group"
                            >
                              <div 
                                onClick={() => toggleDailyTask(dateKey, task.id)}
                                className="cursor-pointer"
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Circle className="w-4 h-4 text-zinc-600" />
                                )}
                              </div>
                              <span 
                                onClick={() => toggleDailyTask(dateKey, task.id)}
                                className={`flex-1 cursor-pointer ${task.completed ? "text-zinc-500 line-through" : "text-zinc-300"}`}
                              >
                                {task.text}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTask(dateKey, task.id)}
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {data.tasks.length === 0 && (
                          <p className="text-xs text-zinc-600 italic py-2 text-center">No tasks</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
