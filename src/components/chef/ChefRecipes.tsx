import { Clock, Trash2, ImageIcon, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Recipe } from '@/types';
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

interface Props {
  recipes: Recipe[];
  onDelete: (recipeId: string) => void;
}

const ChefRecipes = ({ recipes, onDelete }: Props) => {
  if (recipes.length === 0) {
    return (
      <div className="animate-fade-in">
        <Card className="card-elevated">
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">No Recipes Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding your first recipe to showcase your culinary skills!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="card-elevated overflow-hidden group">
            {/* Media */}
            <div className="aspect-video bg-muted relative">
              {recipe.media ? (
                recipe.mediaType === 'image' ? (
                  <img 
                    src={recipe.media} 
                    alt={recipe.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video 
                    src={recipe.media} 
                    className="w-full h-full object-cover"
                    controls
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs flex items-center gap-1">
                {recipe.mediaType === 'video' ? (
                  <Film className="w-3 h-3" />
                ) : (
                  <ImageIcon className="w-3 h-3" />
                )}
              </div>
            </div>

            {/* Content */}
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{recipe.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.timeRequired}</span>
                  </div>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Recipe?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{recipe.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(recipe.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Ingredients</p>
                  <p className="text-sm line-clamp-2">{recipe.ingredients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChefRecipes;
