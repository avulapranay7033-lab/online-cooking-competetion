import { useState } from 'react';
import { X, Upload, Clock, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (recipe: Omit<Recipe, 'id' | 'chefId' | 'createdAt'>) => void;
}

const AddRecipeModal = ({ open, onClose, onSubmit }: Props) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    timeRequired: '',
    media: '',
    mediaType: 'image' as 'image' | 'video'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          media: reader.result as string,
          mediaType: isVideo ? 'video' : 'image'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Recipe name is required';
    }
    if (!formData.ingredients.trim()) {
      newErrors.ingredients = 'Ingredients are required';
    }
    if (!formData.timeRequired.trim()) {
      newErrors.timeRequired = 'Time required is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    onSubmit(formData);
    setFormData({
      name: '',
      ingredients: '',
      timeRequired: '',
      media: '',
      mediaType: 'image'
    });
    toast({
      title: 'Recipe Added!',
      description: 'Your recipe has been uploaded successfully',
    });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      ingredients: '',
      timeRequired: '',
      media: '',
      mediaType: 'image'
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-primary" />
            Add New Recipe
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Recipe Name */}
          <div className="space-y-2">
            <Label htmlFor="recipe-name">Recipe Name</Label>
            <Input
              id="recipe-name"
              placeholder="e.g., Butter Chicken"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input-warm"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients</Label>
            <Textarea
              id="ingredients"
              placeholder="List all ingredients..."
              value={formData.ingredients}
              onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
              className="input-warm min-h-[100px]"
            />
            {errors.ingredients && <p className="text-sm text-destructive">{errors.ingredients}</p>}
          </div>

          {/* Time Required */}
          <div className="space-y-2">
            <Label htmlFor="time">Time Required</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="time"
                placeholder="e.g., 45 minutes"
                value={formData.timeRequired}
                onChange={(e) => setFormData(prev => ({ ...prev, timeRequired: e.target.value }))}
                className="input-warm pl-10"
              />
            </div>
            {errors.timeRequired && <p className="text-sm text-destructive">{errors.timeRequired}</p>}
          </div>

          {/* Media Upload */}
          <div className="space-y-2">
            <Label>Recipe Image/Video</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              {formData.media ? (
                <div className="relative">
                  {formData.mediaType === 'image' ? (
                    <img 
                      src={formData.media} 
                      alt="Preview" 
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  ) : (
                    <video 
                      src={formData.media} 
                      className="max-h-48 mx-auto rounded-lg" 
                      controls
                    />
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData(prev => ({ ...prev, media: '', mediaType: 'image' }))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload image or video
                  </p>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1 btn-hero">
              Add Recipe
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeModal;
