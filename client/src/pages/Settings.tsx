import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Save, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { resetProgress } = useStore();
  const { toast } = useToast();

  const handleReset = () => {
    resetProgress();
    toast({
      title: "Data Reset Complete",
      description: "All your progress has been cleared. Starting fresh!",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <PageHeader 
            title="Settings" 
            description="Manage your data and preferences." 
          />

          <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white mb-2">Data Management</h3>
              <p className="text-zinc-400 text-sm">
                This app uses your browser's Local Storage to save your progress. 
                Clearing your browser cache will remove this data.
              </p>
            </div>
            
            <div className="p-6 bg-zinc-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-white font-medium block">Reset All Progress</span>
                <span className="text-zinc-500 text-sm">This action cannot be undone.</span>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-zinc-950 border-white/10 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                      This will permanently delete your streak, topic progress, and notes from this device.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-900">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white">Yes, delete everything</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border border-white/5 p-6 text-center space-y-4">
             <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-2">
               <Github className="w-6 h-6 text-white" />
             </div>
             <h3 className="text-lg font-semibold text-white">Open Source</h3>
             <p className="text-zinc-400 text-sm max-w-md mx-auto">
               This project is designed as a template for developers tracking their learning journey.
               Built with React, Tailwind, and LocalStorage.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
}
