import { ChefHat, Users, Vote, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getChefs, getAudiences, getCompetitionState } from '@/lib/storage';

const AdminOverview = () => {
  const chefs = getChefs();
  const audiences = getAudiences();
  const competitionState = getCompetitionState();

  const totalVotes = chefs.reduce((sum, chef) => sum + (chef.votes || 0), 0);
  const totalRecipes = chefs.reduce((sum, chef) => sum + chef.recipes.length, 0);

  const stats = [
    {
      title: 'Total Chefs',
      value: chefs.length,
      icon: ChefHat,
      description: 'Registered chefs'
    },
    {
      title: 'Total Audience',
      value: audiences.length,
      icon: Users,
      description: 'Registered voters'
    },
    {
      title: 'Total Votes',
      value: totalVotes,
      icon: Vote,
      description: 'Votes cast'
    },
    {
      title: 'Total Recipes',
      value: totalRecipes,
      icon: TrendingUp,
      description: 'Recipes uploaded'
    }
  ];

  // Top chefs by votes
  const topChefs = [...chefs].sort((a, b) => (b.votes || 0) - (a.votes || 0)).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Competition Status */}
      <Card className={`card-elevated border-l-4 ${competitionState.isResultsDeclared ? 'border-l-primary' : 'border-l-muted-foreground'}`}>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Competition Status</h3>
              <p className="text-muted-foreground">
                {competitionState.isResultsDeclared 
                  ? 'Results have been declared' 
                  : 'Competition is ongoing - Results not yet declared'}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              competitionState.isResultsDeclared 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {competitionState.isResultsDeclared ? 'Completed' : 'In Progress'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="card-elevated">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Chefs */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="font-serif">Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          {topChefs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No chefs registered yet</p>
          ) : (
            <div className="space-y-3">
              {topChefs.map((chef, index) => (
                <div key={chef.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-amber text-primary-foreground' :
                    index === 1 ? 'bg-muted-foreground text-background' :
                    index === 2 ? 'bg-terracotta text-primary-foreground' :
                    'bg-background'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                    {chef.profilePicture ? (
                      <img src={chef.profilePicture} alt={chef.name} className="w-full h-full object-cover" />
                    ) : (
                      <ChefHat className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{chef.name}</p>
                    <p className="text-sm text-muted-foreground">{chef.recipes.length} recipes</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{chef.votes || 0}</p>
                    <p className="text-xs text-muted-foreground">votes</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
