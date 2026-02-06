import { ChefHat, Trophy, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chef } from '@/types';

interface Props {
  chef: Chef;
}

const ChefOverview = ({ chef }: Props) => {
  const stats = [
    {
      title: 'Total Recipes',
      value: chef.recipes.length,
      icon: ChefHat,
      description: 'Recipes uploaded'
    },
    {
      title: 'Total Votes',
      value: chef.votes || 0,
      icon: Trophy,
      description: 'Votes received'
    },
    {
      title: 'Current Rank',
      value: chef.rank ? `#${chef.rank}` : 'TBD',
      icon: TrendingUp,
      description: 'Competition standing'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="card-elevated rounded-2xl p-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
            {chef.profilePicture ? (
              <img src={chef.profilePicture} alt={chef.name} className="w-full h-full object-cover" />
            ) : (
              <ChefHat className="w-10 h-10 text-primary" />
            )}
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">Welcome back, {chef.name}!</h2>
            <p className="text-muted-foreground">
              Ready to showcase your culinary skills? Upload your best recipes and win votes!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
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

      {/* Recent Recipes */}
      {chef.recipes.length > 0 && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="font-serif">Recent Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chef.recipes.slice(0, 3).map((recipe) => (
                <div key={recipe.id} className="rounded-xl overflow-hidden bg-muted">
                  {recipe.media && (
                    <div className="aspect-video bg-secondary">
                      {recipe.mediaType === 'image' ? (
                        <img src={recipe.media} alt={recipe.name} className="w-full h-full object-cover" />
                      ) : (
                        <video src={recipe.media} className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">{recipe.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.timeRequired}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="card-elevated border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">💡 Tips to Win More Votes</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Upload high-quality images of your dishes</li>
            <li>• Write detailed ingredient lists and instructions</li>
            <li>• Share unique and creative recipes</li>
            <li>• Keep your profile picture professional</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChefOverview;
