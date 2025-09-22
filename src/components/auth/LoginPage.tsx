import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-innovation.jpg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to your account.",
      });
      navigate('/');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
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
          <h1 className="text-5xl font-bold mb-6 text-center">Innovation Portal</h1>
          <p className="text-xl text-center opacity-90">
            Connecting brilliant minds with groundbreaking discoveries
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-innovation-gradient bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="scientist@example.com"
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
              <Button 
                type="submit" 
                className="w-full bg-innovation-gradient hover:shadow-glow transition-spring"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-primary hover:text-primary-glow transition-smooth font-medium"
                >
                  Create one here
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-accent rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Demo accounts:
                <br />
                <strong>Scientist:</strong> sarah@example.com
                <br />
                <strong>User:</strong> john@example.com
                <br />
                <strong>Password:</strong> password
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}