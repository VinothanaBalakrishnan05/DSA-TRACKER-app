import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Save, X, Building2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type ApplicationStatus = 'pending' | 'accepted' | 'rejected';
type RoundStatus = 'pending' | 'accepted' | 'rejected';

interface InterviewRound {
  id: string;
  roundName: string;
  roundNumber: number;
  status: RoundStatus;
}

interface JobApplication {
  id: string;
  companyName: string;
  applicationStatus: ApplicationStatus;
  review: string;
  rounds: InterviewRound[];
}

export default function JobTracker() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingRoundId, setEditingRoundId] = useState<string | null>(null);
  const [editingRoundName, setEditingRoundName] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState<string | null>(null);
  const [currentReview, setCurrentReview] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await fetch('/api/job-applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const addCompany = async () => {
    if (!newCompanyName.trim()) return;

    const newApp: JobApplication = {
      id: crypto.randomUUID(),
      companyName: newCompanyName.trim(),
      applicationStatus: 'pending',
      review: '',
      rounds: [
        { id: crypto.randomUUID(), roundName: 'Round 1', roundNumber: 1, status: 'pending' },
        { id: crypto.randomUUID(), roundName: 'Round 2', roundNumber: 2, status: 'pending' },
        { id: crypto.randomUUID(), roundName: 'Round 3', roundNumber: 3, status: 'pending' },
      ]
    };

    try {
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });

      if (response.ok) {
        setApplications([...applications, newApp]);
        setNewCompanyName("");
        toast({ title: "Company added", description: `${newApp.companyName} has been added to your tracker.` });
      }
    } catch (error) {
      console.error('Failed to add company:', error);
    }
  };

  const updateApplicationStatus = async (id: string, status: ApplicationStatus) => {
    try {
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationStatus: status })
      });

      if (response.ok) {
        setApplications(applications.map(app =>
          app.id === id ? { ...app, applicationStatus: status } : app
        ));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const updateRoundStatus = async (appId: string, roundId: string, status: RoundStatus) => {
    try {
      const response = await fetch(`/api/interview-rounds/${roundId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setApplications(applications.map(app =>
          app.id === appId
            ? {
                ...app,
                rounds: app.rounds.map(round =>
                  round.id === roundId ? { ...round, status } : round
                )
              }
            : app
        ));
      }
    } catch (error) {
      console.error('Failed to update round status:', error);
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setApplications(applications.filter(app => app.id !== id));
        toast({ title: "Application deleted", variant: "destructive" });
      }
    } catch (error) {
      console.error('Failed to delete application:', error);
    }
  };

  const startEditingCompany = (app: JobApplication) => {
    setEditingId(app.id);
    setEditingName(app.companyName);
  };

  const saveCompanyName = async (id: string) => {
    if (!editingName.trim()) return;

    try {
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: editingName.trim() })
      });

      if (response.ok) {
        setApplications(applications.map(app =>
          app.id === id ? { ...app, companyName: editingName.trim() } : app
        ));
        setEditingId(null);
        setEditingName("");
      }
    } catch (error) {
      console.error('Failed to update company name:', error);
    }
  };

  const startEditingRound = (round: InterviewRound) => {
    setEditingRoundId(round.id);
    setEditingRoundName(round.roundName);
  };

  const saveRoundName = async (appId: string, roundId: string) => {
    if (!editingRoundName.trim()) return;

    try {
      const response = await fetch(`/api/interview-rounds/${roundId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roundName: editingRoundName.trim() })
      });

      if (response.ok) {
        setApplications(applications.map(app =>
          app.id === appId
            ? {
                ...app,
                rounds: app.rounds.map(round =>
                  round.id === roundId ? { ...round, roundName: editingRoundName.trim() } : round
                )
              }
            : app
        ));
        setEditingRoundId(null);
        setEditingRoundName("");
      }
    } catch (error) {
      console.error('Failed to update round name:', error);
    }
  };

  const openReviewDialog = (app: JobApplication) => {
    setCurrentReviewId(app.id);
    setCurrentReview(app.review);
    setReviewDialogOpen(true);
  };

  const saveReview = async () => {
    if (!currentReviewId) return;

    try {
      const response = await fetch(`/api/job-applications/${currentReviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review: currentReview })
      });

      if (response.ok) {
        setApplications(applications.map(app =>
          app.id === currentReviewId ? { ...app, review: currentReview } : app
        ));
        setReviewDialogOpen(false);
        setCurrentReviewId(null);
        setCurrentReview("");
        toast({ title: "Review saved" });
      }
    } catch (error) {
      console.error('Failed to save review:', error);
    }
  };

  const addRound = async (appId: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    const newRoundNumber = app.rounds.length + 1;
    const newRound: InterviewRound = {
      id: crypto.randomUUID(),
      roundName: `Round ${newRoundNumber}`,
      roundNumber: newRoundNumber,
      status: 'pending'
    };

    try {
      const response = await fetch('/api/interview-rounds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newRound, applicationId: appId })
      });

      if (response.ok) {
        setApplications(applications.map(a =>
          a.id === appId ? { ...a, rounds: [...a.rounds, newRound] } : a
        ));
      }
    } catch (error) {
      console.error('Failed to add round:', error);
    }
  };

  const deleteRound = async (appId: string, roundId: string) => {
    try {
      const response = await fetch(`/api/interview-rounds/${roundId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setApplications(applications.map(app =>
          app.id === appId
            ? { ...app, rounds: app.rounds.filter(r => r.id !== roundId) }
            : app
        ));
      }
    } catch (error) {
      console.error('Failed to delete round:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <PageHeader
            title="Job Applications Tracker"
            description="Track your job applications, interview rounds, and progress."
          >
            <div className="flex gap-2">
              <Input
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Company name..."
                onKeyDown={(e) => e.key === 'Enter' && addCompany()}
                className="w-48 bg-zinc-900/50 border-white/10"
              />
              <Button onClick={addCompany} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </PageHeader>

          {applications.length === 0 ? (
            <Card className="glass-card border-white/10">
              <CardContent className="py-12 text-center">
                <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-500">No applications yet. Add a company to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {applications.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass-card border-white/10 overflow-hidden">
                      <CardHeader className="pb-4 border-b border-white/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {editingId === app.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  className="h-8 bg-zinc-900 border-white/10"
                                  autoFocus
                                />
                                <Button size="icon" variant="ghost" onClick={() => saveCompanyName(app.id)} className="h-8 w-8">
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8">
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <CardTitle className="text-xl">{app.companyName}</CardTitle>
                                <Button size="icon" variant="ghost" onClick={() => startEditingCompany(app)} className="h-8 w-8">
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteApplication(app.id)}
                            className="text-zinc-500 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          {/* Application Status Column */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider">Application</h4>
                            <RadioGroup
                              value={app.applicationStatus}
                              onValueChange={(value) => updateApplicationStatus(app.id, value as ApplicationStatus)}
                            >
                              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                <RadioGroupItem value="pending" id={`${app.id}-pending`} />
                                <Label htmlFor={`${app.id}-pending`} className="cursor-pointer">Pending</Label>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                <RadioGroupItem value="accepted" id={`${app.id}-accepted`} />
                                <Label htmlFor={`${app.id}-accepted`} className="cursor-pointer text-green-500">Accepted</Label>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                <RadioGroupItem value="rejected" id={`${app.id}-rejected`} />
                                <Label htmlFor={`${app.id}-rejected`} className="cursor-pointer text-red-500">Rejected</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Interview Rounds Column */}
                          <div className={cn(
                            "lg:col-span-2 space-y-3",
                            app.applicationStatus !== 'accepted' && "opacity-50 pointer-events-none"
                          )}>
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider">Interview Rounds</h4>
                              {app.applicationStatus === 'accepted' && (
                                <Button size="sm" variant="ghost" onClick={() => addRound(app.id)} className="h-6 text-xs">
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add Round
                                </Button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {app.rounds.map((round) => (
                                <div key={round.id} className="bg-zinc-900/50 rounded-lg p-3 border border-white/5">
                                  <div className="flex items-center justify-between mb-2">
                                    {editingRoundId === round.id ? (
                                      <div className="flex items-center gap-2 flex-1">
                                        <Input
                                          value={editingRoundName}
                                          onChange={(e) => setEditingRoundName(e.target.value)}
                                          className="h-7 text-sm bg-zinc-900 border-white/10"
                                          autoFocus
                                        />
                                        <Button size="icon" variant="ghost" onClick={() => saveRoundName(app.id, round.id)} className="h-7 w-7">
                                          <Save className="w-3 h-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => setEditingRoundId(null)} className="h-7 w-7">
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">{round.roundName}</span>
                                          <Button size="icon" variant="ghost" onClick={() => startEditingRound(round)} className="h-6 w-6">
                                            <Edit2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          onClick={() => deleteRound(app.id, round.id)}
                                          className="h-6 w-6 text-zinc-600 hover:text-red-500"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                  <RadioGroup
                                    value={round.status}
                                    onValueChange={(value) => updateRoundStatus(app.id, round.id, value as RoundStatus)}
                                    className="flex gap-4"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="pending" id={`${round.id}-pending`} />
                                      <Label htmlFor={`${round.id}-pending`} className="cursor-pointer text-xs">Pending</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="accepted" id={`${round.id}-accepted`} />
                                      <Label htmlFor={`${round.id}-accepted`} className="cursor-pointer text-xs text-green-500">Accepted</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="rejected" id={`${round.id}-rejected`} />
                                      <Label htmlFor={`${round.id}-rejected`} className="cursor-pointer text-xs text-red-500">Rejected</Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Review Column */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider">Review</h4>
                            <Button
                              variant="outline"
                              onClick={() => openReviewDialog(app)}
                              className="w-full justify-start text-left h-auto py-3"
                            >
                              <FileText className="w-4 h-4 mr-2 shrink-0" />
                              <span className="truncate text-xs">
                                {app.review ? app.review.substring(0, 50) + (app.review.length > 50 ? '...' : '') : 'Add review...'}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={currentReview}
              onChange={(e) => setCurrentReview(e.target.value)}
              placeholder="Write your notes, feedback, or review here..."
              className="min-h-[200px] bg-zinc-900/50 border-white/10"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveReview}>
                Save Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
