import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getChefById, saveChef, addRecipeToChef, getCompetitionState, generateId, deleteRecipe } from '@/lib/storage';
import { Chef, Recipe } from '@/types';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ChefOverview from '@/components/chef/ChefOverview';
import ChefRecipes from '@/components/chef/ChefRecipes';
import ChefProfile from '@/components/chef/ChefProfile';
import ChefProgress from '@/components/chef/ChefProgress';
import AddRecipeModal from '@/components/chef/AddRecipeModal';

const ChefDashboard = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [chef, setChef] = useState<Chef | null>(null);
  const [showAddRecipe, setShowAddRecipe] = useState(false);

  useEffect(() => {
    if (!auth.isLoggedIn || auth.role !== 'chef') {
      navigate('/register');
      return;
    }
    
    const chefData = getChefById(auth.userId!);
    if (chefData) {
      setChef(chefData);
    }
  }, [auth, navigate]);

  const handleAddRecipe = (recipeData: Omit<Recipe, 'id' | 'chefId' | 'createdAt'>) => {
    if (!chef) return;
    
    const newRecipe: Recipe = {
      ...recipeData,
      id: generateId(),
      chefId: chef.id,
      createdAt: new Date().toISOString()
    };
    
    addRecipeToChef(chef.id, newRecipe);
    setChef(prev => prev ? { ...prev, recipes: [...prev.recipes, newRecipe] } : null);
    setShowAddRecipe(false);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    if (!chef) return;
    deleteRecipe(chef.id, recipeId);
    setChef(prev => prev ? { ...prev, recipes: prev.recipes.filter(r => r.id !== recipeId) } : null);
  };

  const handleUpdateProfile = (data: Partial<Chef>) => {
    if (!chef) return;
    const updatedChef = { ...chef, ...data };
    saveChef(updatedChef);
    setChef(updatedChef);
  };

  const competitionState = getCompetitionState();

  if (!chef) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <ChefOverview chef={chef} />;
      case 'recipes':
        return <ChefRecipes recipes={chef.recipes} onDelete={handleDeleteRecipe} />;
      case 'profile':
        return <ChefProfile chef={chef} onUpdate={handleUpdateProfile} />;
      case 'progress':
        return <ChefProgress chef={chef} competitionState={competitionState} />;
      default:
        return <ChefOverview chef={chef} />;
    }
  };

  return (
    <>
      <DashboardLayout 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onAddRecipe={() => setShowAddRecipe(true)}
      >
        {renderContent()}
      </DashboardLayout>

      <AddRecipeModal 
        open={showAddRecipe} 
        onClose={() => setShowAddRecipe(false)}
        onSubmit={handleAddRecipe}
      />
    </>
  );
};

export default ChefDashboard;
