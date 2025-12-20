import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DsaTopics() {
  const { state, toggleSubtopic, isLoading } = useStore();

  if (isLoading || !state) return null;

  const getStatusColor = (progress: number) => {
    if (progress === 100) return "bg-green-500 text-green-950";
    if (progress > 0) return "bg-yellow-500 text-yellow-950";
    return "bg-zinc-800 text-zinc-400";
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <PageHeader 
            title="DSA Roadmap" 
            description="Master Data Structures & Algorithms one topic at a time." 
          />

          <div className="grid gap-4">
            <Accordion type="multiple" className="space-y-4">
              {state.topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem value={`item-${topic.id}`} className="glass-card rounded-xl border border-white/5 px-4 overflow-hidden">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-4 w-full mr-4">
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-lg text-white">{topic.name}</h3>
                          <p className="text-xs text-zinc-500 mt-1">{topic.subtopics.length} subtopics</p>
                        </div>
                        <div className={cn("px-3 py-1 rounded-full text-xs font-bold font-mono", getStatusColor(topic.progress))}>
                          {topic.progress}%
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-2">
                      <div className="grid gap-3 pl-2">
                        {topic.subtopics.map((sub) => (
                          <div 
                            key={sub.id} 
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => toggleSubtopic(topic.id, sub.id)}
                          >
                            <Checkbox 
                              checked={sub.completed} 
                              className="border-zinc-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary w-5 h-5 rounded-md"
                            />
                            <label className={cn(
                              "text-sm font-medium leading-none cursor-pointer select-none transition-all",
                              sub.completed ? "text-zinc-500 line-through" : "text-zinc-200"
                            )}>
                              {sub.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
}
