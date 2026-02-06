import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Phone, Camera, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { saveChef, generateId, generateOTP, getChefs } from '@/lib/storage';
import { Chef } from '@/types';

interface Props {
  onBack: () => void;
}

const ChefRegistrationForm = ({ onBack }: Props) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    profilePicture: ''
  });
  
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@gmail.com')) {
      newErrors.email = 'Email must end with @gmail.com';
    } else {
      const existingChefs = getChefs();
      if (existingChefs.some(c => c.email === formData.email)) {
        newErrors.email = 'Email already registered';
      }
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must be exactly 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateOTP = () => {
    if (!validateForm()) return;
    
    const newOTP = generateOTP();
    setGeneratedOTP(newOTP);
    setOtpSent(true);
    toast({
      title: 'OTP Generated',
      description: 'Please enter the OTP shown below to verify',
    });
  };

  const handleVerifyOTP = () => {
    if (otp === generatedOTP) {
      setOtpVerified(true);
      toast({
        title: 'OTP Verified!',
        description: 'You can now complete registration',
      });
    } else {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the correct OTP',
        variant: 'destructive'
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!otpVerified) {
      toast({
        title: 'OTP Not Verified',
        description: 'Please verify your mobile number first',
        variant: 'destructive'
      });
      return;
    }

    const chef: Chef = {
      id: generateId(),
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      profilePicture: formData.profilePicture,
      recipes: [],
      votes: 0,
      createdAt: new Date().toISOString()
    };

    saveChef(chef);
    login('chef', chef.id);
    
    toast({
      title: 'Registration Successful!',
      description: 'Welcome to the cooking competition',
    });
    
    navigate('/chef-dashboard');
  };

  return (
    <div className="max-w-lg mx-auto animate-slide-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
          <ChefHat className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-2">Chef Registration</h1>
        <p className="text-muted-foreground">Fill in your details to join the competition</p>
      </div>

      <Card className="card-elevated">
        <CardContent className="pt-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input-warm"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="yourname@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="input-warm pl-10"
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="mobile"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                className="input-warm pl-10"
              />
            </div>
            {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
          </div>

          {/* Profile Picture */}
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="input-warm"
                />
              </div>
            </div>
          </div>

          {/* OTP Section */}
          <div className="space-y-4 pt-4 border-t border-border">
            {!otpSent ? (
              <Button onClick={handleGenerateOTP} className="w-full btn-hero">
                <KeyRound className="w-4 h-4 mr-2" />
                Generate OTP
              </Button>
            ) : !otpVerified ? (
              <>
                <div className="p-4 rounded-lg bg-secondary/50 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Your OTP is:</p>
                  <p className="font-mono text-2xl font-bold text-primary">{generatedOTP}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <div className="flex gap-2">
                    <Input
                      id="otp"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="input-warm"
                    />
                    <Button onClick={handleVerifyOTP} className="btn-hero">
                      Verify
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-secondary text-primary">
                <CheckCircle2 className="w-5 h-5" />
                <span>Mobile number verified successfully!</span>
              </div>
            )}
          </div>

          {/* Submit */}
          {otpVerified && (
            <Button onClick={handleSubmit} className="w-full btn-hero text-lg py-6">
              Complete Registration
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChefRegistrationForm;
