import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Users, ArrowLeft, Flame, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChefRegistrationForm from '@/components/registration/ChefRegistrationForm';
import AudienceRegistrationForm from '@/components/registration/AudienceRegistrationForm';

type Role = 'select' | 'chef' | 'audience';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>('select');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => selectedRole === 'select' ? navigate('/') : setSelectedRole('select')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-primary" />
            <span className="font-serif text-xl font-bold">CookOff</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin-login')}
            className="flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Admin
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-12">
        {selectedRole === 'select' ? (
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Join as a <span className="gradient-text">Participant</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Choose your role to get started with the competition
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Chef Card */}
              <Card 
                className="card-elevated cursor-pointer group border-2 border-transparent hover:border-primary"
                onClick={() => setSelectedRole('chef')}
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
                    <ChefHat className="w-10 h-10 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <CardTitle className="font-serif text-2xl">Register as Chef</CardTitle>
                  <CardDescription className="text-base">
                    Showcase your culinary skills and compete for glory
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Upload your signature recipes</li>
                    <li>✓ Get voted by the audience</li>
                    <li>✓ Win certificates & recognition</li>
                  </ul>
                  <Button className="mt-6 w-full btn-hero">
                    Register as Chef
                  </Button>
                </CardContent>
              </Card>

              {/* Audience Card */}
              <Card 
                className="card-elevated cursor-pointer group border-2 border-transparent hover:border-primary"
                onClick={() => setSelectedRole('audience')}
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
                    <Users className="w-10 h-10 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <CardTitle className="font-serif text-2xl">Register as Audience</CardTitle>
                  <CardDescription className="text-base">
                    Be the judge and vote for your favorite chef
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>✓ Browse all chef recipes</li>
                    <li>✓ Cast your vote</li>
                    <li>✓ Follow the competition</li>
                  </ul>
                  <Button className="mt-6 w-full" variant="outline">
                    Register as Audience
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : selectedRole === 'chef' ? (
          <ChefRegistrationForm onBack={() => setSelectedRole('select')} />
        ) : (
          <AudienceRegistrationForm onBack={() => setSelectedRole('select')} />
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
