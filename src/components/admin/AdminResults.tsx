import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getChefs, getCompetitionState, declareResults, resetCompetition } from '@/lib/storage';
import { Chef, CompetitionState } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminResults = () => {
  const { toast } = useToast();
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [competitionState, setCompetitionState] = useState<CompetitionState>({ isResultsDeclared: false, rankings: [] });

  useEffect(() => {
    setChefs(getChefs().sort((a, b) => (b.votes || 0) - (a.votes || 0)));
    setCompetitionState(getCompetitionState());
  }, []);

  const handleDeclareResults = () => {
    const newState = declareResults();
    setCompetitionState(newState);
    setChefs(getChefs().sort((a, b) => (b.votes || 0) - (a.votes || 0)));
    toast({
      title: '🎉 Results Declared!',
      description: 'Competition results have been announced',
    });
  };

  const handleResetResults = () => {
    resetCompetition();
    setCompetitionState({ isResultsDeclared: false, rankings: [] });
    toast({
      title: 'Results Reset',
      description: 'Competition results have been reset',
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-8 h-8 text-amber" />;
      case 2: return <Medal className="w-8 h-8 text-muted-foreground" />;
      case 3: return <Medal className="w-8 h-8 text-terracotta" />;
      default: return <Award className="w-8 h-8 text-primary" />;
    }
  };

  const getRankLabel = (rank: number) => {
    switch (rank) {
      case 1: return '🥇 First Place';
      case 2: return '🥈 Second Place';
      case 3: return '🥉 Third Place';
      default: return 'Participation Certificate';
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-amber-light to-amber/20 border-amber';
      case 2: return 'bg-gradient-to-r from-muted to-muted-foreground/10 border-muted-foreground';
      case 3: return 'bg-gradient-to-r from-terracotta/10 to-terracotta/20 border-terracotta';
      default: return 'bg-muted border-border';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Card */}
      <Card className="card-elevated">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="font-serif text-2xl font-bold mb-2">Competition Results</h2>
              <p className="text-muted-foreground">
                {competitionState.isResultsDeclared 
                  ? 'Results have been declared. Chefs can now download their certificates.'
                  : 'Declare results to rank chefs based on votes and generate certificates.'}
              </p>
            </div>
            
            {!competitionState.isResultsDeclared ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="btn-hero text-lg px-8 py-6" disabled={chefs.length === 0}>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Declare Results
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Declare Results?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will rank all chefs based on their votes and allow them to download certificates. Are you sure you want to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeclareResults} className="btn-hero">
                      Declare Results
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    Reset Results
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Results?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset the declared results. Chefs will no longer be able to download certificates until results are declared again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetResults}>
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rankings */}
      {competitionState.isResultsDeclared && chefs.length > 0 && (
        <>
          {/* Top 3 */}
          <div className="grid md:grid-cols-3 gap-6">
            {chefs.slice(0, 3).map((chef, index) => (
              <Card key={chef.id} className={`card-elevated border-2 ${getRankBg(index + 1)}`}>
                <CardContent className="py-8 text-center">
                  <div className="mb-4">
                    {getRankIcon(index + 1)}
                  </div>
                  <div className="w-20 h-20 rounded-full bg-background mx-auto mb-4 overflow-hidden border-4 border-background">
                    {chef.profilePicture ? (
                      <img src={chef.profilePicture} alt={chef.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <span className="text-2xl font-bold">{chef.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-1">{chef.name}</h3>
                  <p className="text-sm font-medium mb-2">{getRankLabel(index + 1)}</p>
                  <p className="text-2xl font-bold text-primary">{chef.votes || 0} votes</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Remaining Participants */}
          {chefs.length > 3 && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="font-serif">Participation Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chefs.slice(3).map((chef, index) => (
                    <div key={chef.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                      <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center font-bold text-sm">
                        #{index + 4}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        {chef.profilePicture ? (
                          <img src={chef.profilePicture} alt={chef.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold">{chef.name[0]}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{chef.name}</p>
                        <p className="text-sm text-muted-foreground">{chef.votes || 0} votes</p>
                      </div>
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* No Chefs Message */}
      {chefs.length === 0 && (
        <Card className="card-elevated">
          <CardContent className="py-16 text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold mb-2">No Participants Yet</h3>
            <p className="text-muted-foreground">
              Results can be declared once chefs register for the competition
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminResults;
