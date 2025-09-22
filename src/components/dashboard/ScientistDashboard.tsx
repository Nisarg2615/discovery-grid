import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, Beaker, Calendar } from 'lucide-react';

export default function ScientistDashboard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [field, setField] = useState('');
  const { user, logout, submitInnovation, innovations } = useAuth();
  const { toast } = useToast();

  const userInnovations = innovations.filter(innovation => innovation.user_id === user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast({
        title: "Please fill in all fields",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }

    submitInnovation({ title, description, field });
    setTitle('');
    setDescription('');
    setField('');
    
    toast({
      title: "Innovation submitted!",
      description: "Your innovation has been added to the portal.",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "Successfully logged out of your account.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-elegant">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Beaker className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-innovation-gradient bg-clip-text text-transparent">
              Innovation Portal
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">Welcome back, {user?.name}</span>
            <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submit Innovation Form */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Submit New Innovation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Innovation Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Quantum Computing Algorithm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="transition-smooth focus:shadow-glow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your innovation, its applications, and potential impact..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="transition-smooth focus:shadow-glow resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="field">Field of Innovation</Label>
                  <Input
                    id="field"
                    placeholder="e.g., Computer Science, Biology, Physics"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    className="transition-smooth focus:shadow-glow"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-innovation-gradient hover:shadow-glow transition-spring"
                >
                  Submit Innovation
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* My Innovations */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>My Innovations ({userInnovations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {userInnovations.length === 0 ? (
                <div className="text-center py-8">
                  <Beaker className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No innovations yet. Submit your first one!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {userInnovations.map((innovation) => (
                    <div key={innovation.id} className="p-4 border rounded-lg hover:shadow-elegant transition-smooth">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{innovation.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{innovation.created_at}</span>
                        </div>
                      </div>
                      {innovation.field && (
                        <Badge variant="secondary" className="mb-2">
                          {innovation.field}
                        </Badge>
                      )}
                      <p className="text-muted-foreground text-sm">{innovation.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}