import { Chef, Audience, Recipe, CompetitionState } from '@/types';

// Chef operations
export const getChefs = (): Chef[] => {
  return JSON.parse(localStorage.getItem('chefs') || '[]');
};

export const saveChef = (chef: Chef): void => {
  const chefs = getChefs();
  const existingIndex = chefs.findIndex(c => c.id === chef.id);
  if (existingIndex >= 0) {
    chefs[existingIndex] = chef;
  } else {
    chefs.push(chef);
  }
  localStorage.setItem('chefs', JSON.stringify(chefs));
};

export const deleteChef = (chefId: string): void => {
  const chefs = getChefs().filter(c => c.id !== chefId);
  localStorage.setItem('chefs', JSON.stringify(chefs));
};

export const getChefById = (id: string): Chef | undefined => {
  return getChefs().find(c => c.id === id);
};

// Audience operations
export const getAudiences = (): Audience[] => {
  return JSON.parse(localStorage.getItem('audiences') || '[]');
};

export const saveAudience = (audience: Audience): void => {
  const audiences = getAudiences();
  const existingIndex = audiences.findIndex(a => a.id === audience.id);
  if (existingIndex >= 0) {
    audiences[existingIndex] = audience;
  } else {
    audiences.push(audience);
  }
  localStorage.setItem('audiences', JSON.stringify(audiences));
};

export const deleteAudience = (audienceId: string): void => {
  const audiences = getAudiences().filter(a => a.id !== audienceId);
  localStorage.setItem('audiences', JSON.stringify(audiences));
};

export const getAudienceById = (id: string): Audience | undefined => {
  return getAudiences().find(a => a.id === id);
};

// Recipe operations
export const addRecipeToChef = (chefId: string, recipe: Recipe): void => {
  const chefs = getChefs();
  const chef = chefs.find(c => c.id === chefId);
  if (chef) {
    chef.recipes.push(recipe);
    localStorage.setItem('chefs', JSON.stringify(chefs));
  }
};

export const deleteRecipe = (chefId: string, recipeId: string): void => {
  const chefs = getChefs();
  const chef = chefs.find(c => c.id === chefId);
  if (chef) {
    chef.recipes = chef.recipes.filter(r => r.id !== recipeId);
    localStorage.setItem('chefs', JSON.stringify(chefs));
  }
};

// Voting
export const voteForChef = (audienceId: string, chefId: string): boolean => {
  const audiences = getAudiences();
  const audience = audiences.find(a => a.id === audienceId);
  
  if (!audience || audience.votedChefId) {
    return false;
  }
  
  audience.votedChefId = chefId;
  localStorage.setItem('audiences', JSON.stringify(audiences));
  
  const chefs = getChefs();
  const chef = chefs.find(c => c.id === chefId);
  if (chef) {
    chef.votes = (chef.votes || 0) + 1;
    localStorage.setItem('chefs', JSON.stringify(chefs));
  }
  
  return true;
};

// Competition state
export const getCompetitionState = (): CompetitionState => {
  const saved = localStorage.getItem('competitionState');
  return saved ? JSON.parse(saved) : { isResultsDeclared: false, rankings: [] };
};

export const declareResults = (): CompetitionState => {
  const chefs = getChefs();
  const sortedChefs = [...chefs].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  
  const rankings = sortedChefs.map((chef, index) => ({
    chefId: chef.id,
    rank: index + 1
  }));
  
  // Update chefs with their ranks
  sortedChefs.forEach((chef, index) => {
    chef.rank = index + 1;
  });
  localStorage.setItem('chefs', JSON.stringify(chefs));
  
  const state: CompetitionState = { isResultsDeclared: true, rankings };
  localStorage.setItem('competitionState', JSON.stringify(state));
  
  return state;
};

export const resetCompetition = (): void => {
  localStorage.setItem('competitionState', JSON.stringify({ isResultsDeclared: false, rankings: [] }));
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Generate OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
