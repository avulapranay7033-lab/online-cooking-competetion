import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, Flame, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Admin credentials check
    if (email === 'pranay@123' && password === '939180') {
      login('admin', 'admin');
      toast({
        title: 'Welcome Admin!',
        description: 'Successfully logged in',
      });
      navigate('/admin-dashboard');
    } else {
      toast({
        title: 'Invalid Credentials',
        description: 'Please check your email and password',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-primary" />
            <span className="font-serif text-xl font-bold">CookOff</span>
          </div>
          <div className="w-24" />
        </div>
      </nav>

      <div className="w-full max-w-md px-4 animate-slide-up">
        <Card className="card-elevated">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">Admin Login</CardTitle>
            <CardDescription>Access the competition management panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-warm pl-10"
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-warm pl-10"
                />
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <Button onClick={handleLogin} className="w-full btn-hero text-lg py-6">
              Login
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;
