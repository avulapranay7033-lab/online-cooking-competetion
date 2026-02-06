import { Trophy, Medal, Award, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Chef, CompetitionState } from '@/types';
import { getChefs } from '@/lib/storage';

interface Props {
  chef: Chef;
  competitionState: CompetitionState;
}

const ChefProgress = ({ chef, competitionState }: Props) => {
  const allChefs = getChefs();
  const maxVotes = Math.max(...allChefs.map(c => c.votes || 0), 1);
  const votePercentage = ((chef.votes || 0) / maxVotes) * 100;

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
      default: return 'Participation';
    }
  };

  const generateCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      const gradient = ctx.createLinearGradient(0, 0, 800, 600);
      gradient.addColorStop(0, '#FFF7ED');
      gradient.addColorStop(1, '#FED7AA');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);

      // Border
      ctx.strokeStyle = '#EA580C';
      ctx.lineWidth = 10;
      ctx.strokeRect(20, 20, 760, 560);
      
      // Inner border
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 2;
      ctx.strokeRect(35, 35, 730, 530);

      // Title
      ctx.fillStyle = '#9A3412';
      ctx.font = 'bold 36px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText('Certificate of Achievement', 400, 100);

      // Subtitle
      ctx.fillStyle = '#C2410C';
      ctx.font = '20px Georgia';
      ctx.fillText('Online Cooking Competition 2025', 400, 140);

      // Award text
      ctx.fillStyle = '#1C1917';
      ctx.font = '18px Arial';
      ctx.fillText('This is to certify that', 400, 220);

      // Name
      ctx.fillStyle = '#EA580C';
      ctx.font = 'bold 32px Georgia';
      ctx.fillText(chef.name, 400, 270);

      // Achievement
      ctx.fillStyle = '#1C1917';
      ctx.font = '18px Arial';
      
      const rankText = chef.rank 
        ? chef.rank <= 3 
          ? `has secured ${getRankLabel(chef.rank)} in the competition`
          : 'has successfully participated in the competition'
        : 'has successfully participated in the competition';
      
      ctx.fillText(rankText, 400, 330);

      // Votes
      ctx.font = '16px Arial';
      ctx.fillStyle = '#57534E';
      ctx.fillText(`Total Votes Received: ${chef.votes || 0}`, 400, 380);

      // Date
      ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 400, 480);

      // Signature line
      ctx.strokeStyle = '#1C1917';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(550, 520);
      ctx.lineTo(700, 520);
      ctx.stroke();
      
      ctx.font = '12px Arial';
      ctx.fillText('Competition Administrator', 625, 540);

      // Download
      const link = document.createElement('a');
      link.download = `certificate-${chef.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Progress Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Vote Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your votes</span>
                <span className="font-semibold">{chef.votes || 0}</span>
              </div>
              <Progress value={votePercentage} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {votePercentage.toFixed(1)}% of top performer's votes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Current Standing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                {chef.rank ? getRankIcon(chef.rank) : <span className="text-2xl font-bold">?</span>}
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {chef.rank ? `Rank #${chef.rank}` : 'Not Ranked'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {competitionState.isResultsDeclared 
                    ? 'Final results are out!' 
                    : 'Results not yet declared'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Position */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-serif">Competition Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allChefs
              .sort((a, b) => (b.votes || 0) - (a.votes || 0))
              .slice(0, 5)
              .map((c, index) => (
                <div 
                  key={c.id} 
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    c.id === chef.id ? 'bg-primary/10 border border-primary' : 'bg-muted'
                  }`}
                >
                  <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{c.name} {c.id === chef.id && '(You)'}</p>
                    <p className="text-sm text-muted-foreground">{c.votes || 0} votes</p>
                  </div>
                  {index < 3 && getRankIcon(index + 1)}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificate Download */}
      {competitionState.isResultsDeclared && (
        <Card className="card-elevated border-2 border-primary">
          <CardContent className="py-8 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              {chef.rank ? getRankIcon(chef.rank) : <Award className="w-10 h-10 text-primary" />}
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">
              {chef.rank && chef.rank <= 3 
                ? `Congratulations! You secured ${getRankLabel(chef.rank)}!`
                : 'Thank you for participating!'}
            </h3>
            <p className="text-muted-foreground mb-6">
              Download your official certificate below
            </p>
            <Button onClick={generateCertificate} className="btn-hero">
              <Download className="w-4 h-4 mr-2" />
              Download Certificate
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChefProgress;
