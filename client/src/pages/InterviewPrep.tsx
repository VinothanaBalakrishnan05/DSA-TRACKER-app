import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Brain, Star } from "lucide-react";

export default function InterviewPrep() {
  const { state, updateSubject, isLoading } = useStore();

  if (isLoading || !state) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <PageHeader 
            title="Interview Preparation" 
            description="Track your readiness across core CS subjects." 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.interviewSubjects.map((subject, idx) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Brain className="w-24 h-24 text-white transform rotate-12 translate-x-4 -translate-y-4" />
                </div>

                <h3 className="text-xl font-bold text-white mb-6 relative z-10">{subject.name}</h3>

                <div className="space-y-8 relative z-10">
                  {/* Preparation Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Material Covered</span>
                      <span className="font-mono text-white">{subject.progress}%</span>
                    </div>
                    <div className="relative h-4 w-full bg-zinc-900 rounded-full overflow-hidden cursor-pointer">
                      {/* Interactive click area for progress */}
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={subject.progress || 0}
                        onChange={(e) => updateSubject(subject.id, { progress: parseInt(e.target.value) })}
                        className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                      />
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 ease-out"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Confidence Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Confidence Level</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-4 h-4 ${star <= (subject.confidence || 0) ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <Slider
                      value={[subject.confidence || 1]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(val) => updateSubject(subject.id, { confidence: val[0] })}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-zinc-600 px-1 font-mono">
                      <span>Novice</span>
                      <span>Expert</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
