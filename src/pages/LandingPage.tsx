import { useNavigate } from 'react-router-dom';
import { ChefHat, Users, Trophy, ArrowRight, Star, Flame, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-cooking.jpg';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: ChefHat,
      title: 'Showcase Your Skills',
      description: 'Upload your best recipes with photos and videos to impress the audience.'
    },
    {
      icon: Users,
      title: 'Public Voting',
      description: 'Let the audience decide who deserves the crown through fair voting.'
    },
    {
      icon: Trophy,
      title: 'Win Certificates',
      description: 'Top performers receive recognition with downloadable certificates.'
    }
  ];

  const stats = [
    { value: '100+', label: 'Talented Chefs' },
    { value: '500+', label: 'Active Voters' },
    { value: '1000+', label: 'Recipes Shared' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-primary" />
            <span className="font-serif text-xl font-bold">CookOff</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin-login')}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Admin Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-2xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Season 2025 Now Open</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Online Cooking</span>
              <br />
              <span className="text-foreground">Competition</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Join the ultimate culinary showdown where talented chefs compete for glory. 
              Showcase your signature dishes and let the audience crown the champion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="btn-hero text-lg px-8 py-6"
                onClick={() => navigate('/register')}
              >
                Get Participated
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 border-2"
                onClick={() => navigate('/register')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From registration to victory, here's your journey to culinary stardom
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-elevated p-8 rounded-2xl text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-serif text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Ready to Compete?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Whether you're a seasoned chef or a passionate home cook, this is your stage. 
              Register now and let your flavors tell your story.
            </p>
            <Button 
              size="lg" 
              className="btn-hero text-lg px-12 py-6"
              onClick={() => navigate('/register')}
            >
              Join the Competition
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="font-serif font-semibold">CookOff</span>
          </div>
          <p className="text-sm">© 2025 Online Cooking Competition. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
