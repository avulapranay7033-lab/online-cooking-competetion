import { useState, useEffect } from 'react';
import { ChefHat, Phone, Trash2, Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getChefs, deleteChef } from '@/lib/storage';
import { Chef } from '@/types';
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

const AdminChefs = () => {
  const { toast } = useToast();
  const [chefs, setChefs] = useState<Chef[]>([]);

  useEffect(() => {
    setChefs(getChefs().sort((a, b) => (b.votes || 0) - (a.votes || 0)));
  }, []);

  const handleDeleteChef = (chefId: string, chefName: string) => {
    deleteChef(chefId);
    setChefs(prev => prev.filter(c => c.id !== chefId));
    toast({
      title: 'Chef Removed',
      description: `${chefName} has been removed from the competition`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold">Registered Chefs</h2>
          <p className="text-muted-foreground">Manage all participating chefs</p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-secondary">
          <span className="font-bold">{chefs.length}</span>
          <span className="text-muted-foreground ml-1">Total</span>
        </div>
      </div>

      {/* Chef Cards */}
      {chefs.length === 0 ? (
        <Card className="card-elevated">
          <CardContent className="py-16 text-center">
            <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold mb-2">No Chefs Registered</h3>
            <p className="text-muted-foreground">Chefs will appear here once they register</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {chefs.map((chef, index) => (
            <Card key={chef.id} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Rank & Avatar */}
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-amber text-primary-foreground' :
                      index === 1 ? 'bg-muted-foreground text-background' :
                      index === 2 ? 'bg-terracotta text-primary-foreground' :
                      'bg-muted'
                    }`}>
                      #{index + 1}
                    </span>
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                      {chef.profilePicture ? (
                        <img src={chef.profilePicture} alt={chef.name} className="w-full h-full object-cover" />
                      ) : (
                        <ChefHat className="w-7 h-7 text-primary" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-semibold">{chef.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mobile</p>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <p>{chef.mobile}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Votes</p>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-primary" />
                        <p className="font-bold">{chef.votes || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Chef
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Chef?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {chef.name}? This will delete all their recipes and votes.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteChef(chef.id, chef.name)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Recipes */}
                {chef.recipes.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">
                      Recipes ({chef.recipes.length})
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {chef.recipes.map((recipe) => (
                        <div key={recipe.id} className="flex-shrink-0 w-48 rounded-lg bg-muted p-3">
                          {recipe.media && (
                            <div className="aspect-video rounded-md overflow-hidden mb-2">
                              {recipe.mediaType === 'image' ? (
                                <img src={recipe.media} alt={recipe.name} className="w-full h-full object-cover" />
                              ) : (
                                <video src={recipe.media} className="w-full h-full object-cover" />
                              )}
                            </div>
                          )}
                          <p className="font-medium text-sm line-clamp-1">{recipe.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{recipe.timeRequired}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminChefs;
