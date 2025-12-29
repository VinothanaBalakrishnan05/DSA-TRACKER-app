import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function MonthlyTracker() {
  const { getDayData, isLoading } = useStore();
  
  if (isLoading) return null;

  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <PageHeader 
            title="Monthly Tracker" 
            description={`Your progress overview for ${format(today, "MMMM yyyy")}.`} 
          />

          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-lg overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="bg-zinc-950 p-2 text-center text-xs font-bold text-zinc-500 uppercase">
                  {d}
                </div>
              ))}
              
              {/* Empty slots for start of month */}
              {Array.from({ length: start.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-zinc-950/50 min-h-[100px]" />
              ))}

              {days.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const data = getDayData(dateKey);
                const completedCount = data.tasks.filter(t => t.completed).length;
                const totalCount = data.tasks.length;
                const hasNotes = !!data.notes;

                return (
                  <div 
                    key={dateKey} 
                    className={cn(
                      "bg-zinc-950 p-2 min-h-[100px] border-white/5 flex flex-col gap-1 transition-colors",
                      isToday(day) && "bg-primary/5 ring-1 ring-primary/50 z-10"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-medium",
                      isToday(day) ? "text-primary" : "text-zinc-500"
                    )}>
                      {format(day, "d")}
                    </span>
                    
                    {totalCount > 0 && (
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="text-[10px] text-zinc-400 mb-1">
                          {completedCount}/{totalCount} tasks
                        </div>
                        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-white h-full transition-all"
                            style={{ width: `${(completedCount / totalCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {hasNotes && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mx-auto mt-auto mb-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
