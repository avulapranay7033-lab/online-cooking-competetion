import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Vote, LogOut, Flame, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAudienceById, getChefs, voteForChef, saveAudience } from '@/lib/storage';
import { Audience, Chef } from '@/types';

const AudienceDashboard = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const { toast } = useToast();
  const [audience, setAudience] = useState<Audience | null>(null);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [votedChef, setVotedChef] = useState<Chef | null>(null);

  useEffect(() => {
    if (!auth.isLoggedIn || auth.role !== 'audience') {
      navigate('/register');
      return;
    }

    const audienceData = getAudienceById(auth.userId!);
    if (audienceData) {
      setAudience(audienceData);
      
      const allChefs = getChefs();
      setChefs(allChefs);
      
      if (audienceData.votedChefId) {
        const voted = allChefs.find(c => c.id === audienceData.votedChefId);
        setVotedChef(voted || null);
      }
    }
  }, [auth, navigate]);

  const handleVote = (chefId: string) => {
    if (!audience) return;

    if (audience.votedChefId) {
      toast({
        title: 'Already Voted',
        description: 'You have already used your vote',
        variant: 'destructive'
      });
      return;
    }

    const success = voteForChef(audience.id, chefId);
    
    if (success) {
      const updatedAudience = { ...audience, votedChefId: chefId };
      setAudience(updatedAudience);
      
      const chef = chefs.find(c => c.id === chefId);
      setVotedChef(chef || null);
      
      // Refresh chefs to show updated vote count
      setChefs(getChefs());
      
      toast({
        title: 'Vote Submitted!',
        description: `You voted for ${chef?.name}`,
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!audience) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-primary" />
            <span className="font-serif text-xl font-bold">CookOff</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {audience.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Vote for Your <span className="gradient-text">Favorite Chef</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse through the talented chefs and their delicious recipes. Cast your vote wisely - you can only vote once!
          </p>
        </div>

        {/* Already Voted Message */}
        {votedChef && (
          <div className="mb-8 p-6 rounded-2xl bg-secondary border border-primary animate-fade-in">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">You've already voted!</h3>
                <p className="text-muted-foreground">
                  Your vote went to <span className="font-semibold text-primary">{votedChef.name}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chef Cards */}
        {votedChef ? (
          // Show only voted chef
          <div className="max-w-2xl mx-auto">
            <ChefCard chef={votedChef} isVoted={true} onVote={() => {}} disabled={true} />
          </div>
        ) : (
          // Show all chefs
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chefs.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold mb-2">No Chefs Yet</h3>
                <p className="text-muted-foreground">
                  Check back soon - chefs are still registering!
                </p>
              </div>
            ) : (
              chefs.map((chef) => (
                <ChefCard 
                  key={chef.id} 
                  chef={chef} 
                  isVoted={false}
                  onVote={() => handleVote(chef.id)}
                  disabled={!!audience.votedChefId}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface ChefCardProps {
  chef: Chef;
  isVoted: boolean;
  onVote: () => void;
  disabled: boolean;
}

const ChefCard = ({ chef, isVoted, onVote, disabled }: ChefCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={`card-elevated overflow-hidden ${isVoted ? 'border-2 border-primary' : ''}`}>
      {/* Chef Header */}
      <div className="p-6 flex items-center gap-4 border-b border-border">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
          {chef.profilePicture ? (
            <img src={chef.profilePicture} alt={chef.name} className="w-full h-full object-cover" />
          ) : (
            <ChefHat className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-xl font-semibold">{chef.name}</h3>
          <p className="text-sm text-muted-foreground">
            {chef.recipes.length} {chef.recipes.length === 1 ? 'Recipe' : 'Recipes'}
          </p>
        </div>
        {isVoted && (
          <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
            Your Vote
          </div>
        )}
      </div>

      {/* Recipes */}
      <CardContent className="p-4">
        {chef.recipes.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">No recipes uploaded yet</p>
        ) : (
          <div className="space-y-3">
            {chef.recipes.slice(0, expanded ? undefined : 2).map((recipe) => (
              <div key={recipe.id} className="flex gap-3 p-2 rounded-lg bg-muted">
                {recipe.media && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    {recipe.mediaType === 'image' ? (
                      <img src={recipe.media} alt={recipe.name} className="w-full h-full object-cover" />
                    ) : (
                      <video src={recipe.media} className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{recipe.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{recipe.timeRequired}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {recipe.ingredients}
                  </p>
                </div>
              </div>
            ))}
            
            {chef.recipes.length > 2 && (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="w-full text-sm text-primary hover:underline"
              >
                {expanded ? 'Show less' : `+${chef.recipes.length - 2} more recipes`}
              </button>
            )}
          </div>
        )}

        {/* Vote Button */}
        {!isVoted && (
          <Button 
            onClick={onVote} 
            disabled={disabled}
            className="w-full mt-4 btn-hero"
          >
            <Vote className="w-4 h-4 mr-2" />
            Vote for {chef.name}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AudienceDashboard;
