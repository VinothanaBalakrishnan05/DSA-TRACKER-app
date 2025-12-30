import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import DsaTopics from "@/pages/DsaTopics";
import DailyTracker from "@/pages/DailyTracker";
import WeeklyTracker from "@/pages/WeeklyTracker";
import MonthlyTracker from "@/pages/MonthlyTracker";
import InterviewPrep from "@/pages/InterviewPrep";
import Settings from "@/pages/Settings";
import JobTracker from "@/pages/JobTracker";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dsa" component={DsaTopics} />
      <Route path="/daily" component={DailyTracker} />
      <Route path="/weekly" component={WeeklyTracker} />
      <Route path="/monthly" component={MonthlyTracker} />
      <Route path="/interview" component={InterviewPrep} />
      <Route path="/jobs" component={JobTracker} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
