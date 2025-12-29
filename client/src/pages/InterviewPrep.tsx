import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function InterviewPrep() {
  const { state, toggleCoreItem, isLoading } = useStore();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (isLoading || !state) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <PageHeader 
            title="Core Subjects" 
            description="Master the fundamental concepts for your technical interviews." 
          />

          <div className="grid grid-cols-1 gap-6">
            {state.interviewSubjects.map((subject, idx) => {
              const isExpanded = expandedId === subject.id;
              
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
                >
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : subject.id)}
                    className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Brain className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <Progress value={subject.progress} className="h-1.5 w-32 bg-zinc-800" indicatorClassName="bg-primary" />
                          <span className="text-xs text-zinc-500 font-mono">{subject.progress}% Covered</span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-zinc-950/50"
                      >
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {subject.items.map((item) => (
                            <div 
                              key={item.id}
                              onClick={() => toggleCoreItem(subject.id, item.id)}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group",
                                item.completed 
                                  ? "bg-primary/5 border-primary/20" 
                                  : "border-white/5 hover:bg-white/5 hover:border-white/10"
                              )}
                            >
                              <div className="shrink-0">
                                {item.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                  <Circle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
                                )}
                              </div>
                              <span className={cn(
                                "text-sm font-medium transition-colors",
                                item.completed ? "text-zinc-500 line-through" : "text-zinc-300"
                              )}>
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
