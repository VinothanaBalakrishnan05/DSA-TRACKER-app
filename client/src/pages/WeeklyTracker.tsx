import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

export default function WeeklyTracker() {
  const { getDayData, isLoading } = useStore();
  
  if (isLoading) return null;

  const start = startOfWeek(new Date());
  const end = endOfWeek(new Date());
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <PageHeader 
            title="Weekly Tracker" 
            description="Overview of your tasks and notes for this week." 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {days.map((day, i) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const data = getDayData(dateKey);
              
              return (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="glass-card border-white/10 h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold flex justify-between items-center text-white">
                        <span>{format(day, "EEEE")}</span>
                        <span className="text-xs text-zinc-500">{format(day, "MMM do")}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {data.tasks.slice(0, 3).map((task) => (
                          <div key={task.id} className="flex items-center gap-2 text-sm">
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-zinc-600" />
                            )}
                            <span className={task.completed ? "text-zinc-500 line-through" : "text-zinc-300"}>
                              {task.text}
                            </span>
                          </div>
                        ))}
                        {data.tasks.length > 3 && (
                          <p className="text-xs text-zinc-500">+{data.tasks.length - 3} more tasks</p>
                        )}
                        {data.tasks.length === 0 && (
                          <p className="text-xs text-zinc-600 italic">No tasks</p>
                        )}
                      </div>
                      
                      {data.notes && (
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-xs text-zinc-400 line-clamp-3 italic">
                            {data.notes}
                          </p>
                        </div>
                      )}
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
