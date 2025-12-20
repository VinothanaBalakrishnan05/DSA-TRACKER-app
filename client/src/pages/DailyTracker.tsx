import { useEffect } from "react";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { format } from "date-fns";
import { Check, Edit3, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Textarea } from "@/components/ui/textarea";

export default function DailyTracker() {
  const { state, toggleDailyTask, updateNotes, isLoading } = useStore();

  const today = format(new Date(), "EEEE, MMMM do, yyyy");
  
  const dailyTasks = state?.dailyTasks || [];
  const allCompleted = dailyTasks.length > 0 && dailyTasks.every(t => t.completed);

  useEffect(() => {
    if (allCompleted && dailyTasks.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#aaaaaa', '#555555']
      });
    }
  }, [allCompleted, dailyTasks]);

  if (isLoading || !state) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <PageHeader 
            title="Daily Routine" 
            description="Consistency is the key to mastery. Build your streak."
          >
            <div className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-zinc-300">
              <Calendar className="w-4 h-4" />
              {today}
            </div>
          </PageHeader>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Tasks</h2>
                {allCompleted && (
                  <span className="text-green-500 text-sm font-bold animate-pulse">All Done! 🎉</span>
                )}
              </div>
              
              <div className="space-y-3">
                {state.dailyTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    onClick={() => toggleDailyTask(task.id)}
                    className={`
                      relative group cursor-pointer p-4 rounded-xl border transition-all duration-300
                      ${task.completed 
                        ? "bg-primary/5 border-primary/20" 
                        : "glass-card hover:bg-white/5 hover:border-white/10"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300
                        ${task.completed ? "bg-primary border-primary" : "border-zinc-600 group-hover:border-zinc-400"}
                      `}>
                        {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className={`text-base font-medium transition-all ${task.completed ? "text-zinc-500 line-through" : "text-zinc-200"}`}>
                        {task.text}
                      </span>
                    </div>
                  </motion.div>
                ))}
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
                  value={state.notes}
                  onChange={(e) => updateNotes(e.target.value)}
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
