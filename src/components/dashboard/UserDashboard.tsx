import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Search, Lightbulb, Calendar, User } from 'lucide-react';

export default function UserDashboard() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showAllInnovations, setShowAllInnovations] = useState(true);
  const { user, logout, searchInnovations, getAllInnovations } = useAuth();
  const { toast } = useToast();

  const allInnovations = getAllInnovations();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      toast({
        title: "Enter a search term",
        description: "Please enter a keyword to search for innovations.",
        variant: "destructive",
      });
      return;
    }

    const results = searchInnovations(searchKeyword);
    setSearchResults(results);
    setShowAllInnovations(false);
    
    toast({
      title: "Search completed",
      description: `Found ${results.length} innovation${results.length !== 1 ? 's' : ''} matching "${searchKeyword}"`,
    });
  };

  const clearSearch = () => {
    setSearchKeyword('');
    setSearchResults([]);
    setShowAllInnovations(true);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "Successfully logged out of your account.",
    });
  };

  const displayedInnovations = showAllInnovations ? allInnovations : searchResults;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-elegant">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Lightbulb className="h-8 w-8 text-primary" />
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search Section */}
          <Card className="lg:col-span-1 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-primary" />
                <span>Discover Innovations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch} className="space-y-4">
                <Input
                  placeholder="Search by keyword, field, or description..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="transition-smooth focus:shadow-glow"
                />
                <Button 
                  type="submit" 
                  className="w-full bg-innovation-gradient hover:shadow-glow transition-spring"
                >
                  Search Innovations
                </Button>
              </form>
              
              {!showAllInnovations && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Showing results for "{searchKeyword}"
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={clearSearch}
                    className="w-full"
                  >
                    Show All Innovations
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Popular Fields</h3>
                <div className="flex flex-wrap gap-2">
                  {['Computer Science', 'Biology', 'Physics', 'Materials Science'].map((field) => (
                    <Badge 
                      key={field} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-accent transition-smooth"
                      onClick={() => {
                        setSearchKeyword(field);
                        const results = searchInnovations(field);
                        setSearchResults(results);
                        setShowAllInnovations(false);
                      }}
                    >
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Innovations List */}
          <Card className="lg:col-span-2 shadow-elegant">
            <CardHeader>
              <CardTitle>
                {showAllInnovations 
                  ? `All Innovations (${allInnovations.length})` 
                  : `Search Results (${searchResults.length})`
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {displayedInnovations.length === 0 ? (
                <div className="text-center py-12">
                  <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {showAllInnovations ? 'No innovations yet' : 'No results found'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {showAllInnovations 
                      ? 'Check back later for new innovations from our researchers.'
                      : 'Try searching with different keywords or explore all innovations.'
                    }
                  </p>
                  {!showAllInnovations && (
                    <Button variant="outline" onClick={clearSearch}>
                      Show All Innovations
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {displayedInnovations.map((innovation) => (
                    <div 
                      key={innovation.id} 
                      className="p-6 border rounded-lg hover:shadow-elegant transition-spring bg-card-gradient"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-xl text-foreground">
                          {innovation.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{innovation.created_at}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        {innovation.field && (
                          <Badge variant="secondary">
                            {innovation.field}
                          </Badge>
                        )}
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{innovation.scientist_name}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {innovation.description}
                      </p>
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