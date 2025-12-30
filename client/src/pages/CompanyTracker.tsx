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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type ApplicationStatus = 'pending' | 'accepted' | 'rejected';
type InterviewStatus = 'pending' | 'accepted' | 'rejected';

interface InterviewRound {
  id: string;
  name: string;
  status: InterviewStatus;
}

interface Company {
  id: string;
  name: string;
  applicationStatus: ApplicationStatus;
  rounds: InterviewRound[];
  review: string;
}

const STORAGE_KEY = 'company-tracker';

export default function CompanyTracker() {
  const [companies, setCompanies] = useState<Company[]>([]);
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
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setCompanies(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  };

  const saveCompanies = (updatedCompanies: Company[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCompanies));
      setCompanies(updatedCompanies);
    } catch (error) {
      console.error('Failed to save companies:', error);
    }
  };

  const addCompany = () => {
    if (!newCompanyName.trim()) return;

    const newCompany: Company = {
      id: crypto.randomUUID(),
      name: newCompanyName.trim(),
      applicationStatus: 'pending',
      rounds: [
        { id: crypto.randomUUID(), name: 'Round 1', status: 'pending' },
        { id: crypto.randomUUID(), name: 'Round 2', status: 'pending' },
        { id: crypto.randomUUID(), name: 'Round 3', status: 'pending' },
      ],
      review: ''
    };

    const updated = [...companies, newCompany];
    saveCompanies(updated);
    setNewCompanyName("");
    toast({ title: "Company added", description: `${newCompany.name} has been added.` });
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus) => {
    const updated = companies.map(c =>
      c.id === id ? { ...c, applicationStatus: status } : c
    );
    saveCompanies(updated);
  };

  const updateRoundStatus = (companyId: string, roundId: string, status: InterviewStatus) => {
    const updated = companies.map(c =>
      c.id === companyId
        ? {
            ...c,
            rounds: c.rounds.map(r =>
              r.id === roundId ? { ...r, status } : r
            )
          }
        : c
    );
    saveCompanies(updated);
  };

  const deleteCompany = (id: string) => {
    const updated = companies.filter(c => c.id !== id);
    saveCompanies(updated);
    toast({ title: "Company deleted", variant: "destructive" });
  };

  const startEditingCompany = (company: Company) => {
    setEditingId(company.id);
    setEditingName(company.name);
  };

  const saveCompanyName = (id: string) => {
    if (!editingName.trim()) return;

    const updated = companies.map(c =>
      c.id === id ? { ...c, name: editingName.trim() } : c
    );
    saveCompanies(updated);
    setEditingId(null);
    setEditingName("");
  };

  const startEditingRound = (round: InterviewRound) => {
    setEditingRoundId(round.id);
    setEditingRoundName(round.name);
  };

  const saveRoundName = (companyId: string, roundId: string) => {
    if (!editingRoundName.trim()) return;

    const updated = companies.map(c =>
      c.id === companyId
        ? {
            ...c,
            rounds: c.rounds.map(r =>
              r.id === roundId ? { ...r, name: editingRoundName.trim() } : r
            )
          }
        : c
    );
    saveCompanies(updated);
    setEditingRoundId(null);
    setEditingRoundName("");
  };

  const openReviewDialog = (company: Company) => {
    setCurrentReviewId(company.id);
    setCurrentReview(company.review);
    setReviewDialogOpen(true);
  };

  const saveReview = () => {
    if (!currentReviewId) return;

    const updated = companies.map(c =>
      c.id === currentReviewId ? { ...c, review: currentReview } : c
    );
    saveCompanies(updated);
    setReviewDialogOpen(false);
    setCurrentReviewId(null);
    setCurrentReview("");
    toast({ title: "Review saved" });
  };

  const deleteRound = (companyId: string, roundId: string) => {
    const updated = companies.map(c =>
      c.id === companyId
        ? { ...c, rounds: c.rounds.filter(r => r.id !== roundId) }
        : c
    );
    saveCompanies(updated);
  };

  const addRound = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (!company) return;

    const newRound: InterviewRound = {
      id: crypto.randomUUID(),
      name: `Round ${company.rounds.length + 1}`,
      status: 'pending'
    };

    const updated = companies.map(c =>
      c.id === companyId ? { ...c, rounds: [...c.rounds, newRound] } : c
    );
    saveCompanies(updated);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <PageHeader
            title="Company Tracker"
            description="Track companies, applications, and interview rounds."
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

          {companies.length === 0 ? (
            <Card className="glass-card border-white/10">
              <CardContent className="py-12 text-center">
                <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-500">No companies yet. Add one to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {companies.map((company, index) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="glass-card border-white/10 overflow-hidden">
                      <CardHeader className="pb-4 border-b border-white/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {editingId === company.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  className="h-8 bg-zinc-900 border-white/10"
                                  autoFocus
                                />
                                <Button size="icon" variant="ghost" onClick={() => saveCompanyName(company.id)} className="h-8 w-8">
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8">
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <>
                                <CardTitle className="text-xl">{company.name}</CardTitle>
                                <Button size="icon" variant="ghost" onClick={() => startEditingCompany(company)} className="h-8 w-8">
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteCompany(company.id)}
                            className="text-zinc-500 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          {/* Companies List Column */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider">Company</h4>
                            <div className="bg-zinc-900/30 rounded-lg p-4 border border-white/5">
                              <p className="text-sm font-medium text-white">{company.name}</p>
                            </div>
                          </div>

                          {/* Application Status Column */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider">Application</h4>
                            <RadioGroup
                              value={company.applicationStatus}
                              onValueChange={(value) => updateApplicationStatus(company.id, value as ApplicationStatus)}
                            >
                              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                <RadioGroupItem value="pending" id={`${company.id}-pending`} />
                                <Label htmlFor={`${company.id}-pending`} className="cursor-pointer">Pending</Label>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                <RadioGroupItem value="accepted" id={`${company.id}-accepted`} />
                                <Label htmlFor={`${company.id}-accepted`} className="cursor-pointer text-green-500">Accepted</Label>
                              </div>
                              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5">
                                <RadioGroupItem value="rejected" id={`${company.id}-rejected`} />
                                <Label htmlFor={`${company.id}-rejected`} className="cursor-pointer text-red-500">Rejected</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Interview Rounds Column */}
                          <div className={cn(
                            "lg:col-span-1 space-y-3",
                            company.applicationStatus !== 'accepted' && "opacity-50 pointer-events-none"
                          )}>
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider">Interviews</h4>
                              {company.applicationStatus === 'accepted' && (
                                <Button size="sm" variant="ghost" onClick={() => addRound(company.id)} className="h-6 text-xs p-0">
                                  <Plus className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                            <div className="space-y-2">
                              {company.rounds.map((round) => (
                                <div key={round.id} className="bg-zinc-900/50 rounded-lg p-2 border border-white/5">
                                  <div className="flex items-center justify-between mb-2">
                                    {editingRoundId === round.id ? (
                                      <div className="flex items-center gap-1 flex-1">
                                        <Input
                                          value={editingRoundName}
                                          onChange={(e) => setEditingRoundName(e.target.value)}
                                          className="h-6 text-xs bg-zinc-900 border-white/10"
                                          autoFocus
                                        />
                                        <Button size="icon" variant="ghost" onClick={() => saveRoundName(company.id, round.id)} className="h-6 w-6">
                                          <Save className="w-3 h-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => setEditingRoundId(null)} className="h-6 w-6">
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="flex items-center gap-1">
                                          <span className="text-xs font-medium">{round.name}</span>
                                          <Button size="icon" variant="ghost" onClick={() => startEditingRound(round)} className="h-5 w-5">
                                            <Edit2 className="w-2 h-2" />
                                          </Button>
                                        </div>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          onClick={() => deleteRound(company.id, round.id)}
                                          className="h-5 w-5 text-zinc-600 hover:text-red-500"
                                        >
                                          <Trash2 className="w-2 h-2" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                  <RadioGroup
                                    value={round.status}
                                    onValueChange={(value) => updateRoundStatus(company.id, round.id, value as InterviewStatus)}
                                    className="flex gap-2"
                                  >
                                    <div className="flex items-center space-x-1">
                                      <RadioGroupItem value="pending" id={`${round.id}-pending`} className="w-3 h-3" />
                                      <Label htmlFor={`${round.id}-pending`} className="cursor-pointer text-xs">P</Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <RadioGroupItem value="accepted" id={`${round.id}-accepted`} className="w-3 h-3" />
                                      <Label htmlFor={`${round.id}-accepted`} className="cursor-pointer text-xs text-green-500">A</Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <RadioGroupItem value="rejected" id={`${round.id}-rejected`} className="w-3 h-3" />
                                      <Label htmlFor={`${round.id}-rejected`} className="cursor-pointer text-xs text-red-500">R</Label>
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
                              onClick={() => openReviewDialog(company)}
                              className="w-full justify-start text-left h-auto py-3"
                            >
                              <FileText className="w-4 h-4 mr-2 shrink-0" />
                              <span className="truncate text-xs">
                                {company.review ? company.review.substring(0, 30) + (company.review.length > 30 ? '...' : '') : 'Add review...'}
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
            <DialogTitle>Company Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={currentReview}
              onChange={(e) => setCurrentReview(e.target.value)}
              placeholder="Write your notes about this company..."
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
