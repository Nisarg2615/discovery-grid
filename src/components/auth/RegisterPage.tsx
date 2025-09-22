import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-innovation.jpg';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'scientist' | 'user' | ''>('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast({
        title: "Please select a role",
        description: "Choose whether you're a scientist or a user.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const success = await register(name, email, password, role);
    
    if (success) {
      toast({
        title: "Account created!",
        description: "Welcome to the Innovation Portal.",
      });
      navigate('/');
    } else {
      toast({
        title: "Registration failed",
        description: "Email already exists. Please try a different email.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-hero-gradient bg-cover bg-center relative"
        style={{ backgroundImage: `linear-gradient(rgba(66, 66, 255, 0.3), rgba(138, 43, 226, 0.3)), url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-innovation-gradient opacity-60"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <h1 className="text-5xl font-bold mb-6 text-center">Join Innovation</h1>
          <p className="text-xl text-center opacity-90">
            Share your discoveries or explore cutting-edge research
          </p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-innovation-gradient bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Join our community of innovators
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Dr. Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="transition-smooth focus:shadow-glow"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-smooth focus:shadow-glow"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-smooth focus:shadow-glow"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
                <Select value={role} onValueChange={(value: 'scientist' | 'user') => setRole(value)}>
                  <SelectTrigger className="transition-smooth focus:shadow-glow">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scientist">Scientist / Researcher</SelectItem>
                    <SelectItem value="user">Innovation Explorer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-innovation-gradient hover:shadow-glow transition-spring"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary-glow transition-smooth font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}