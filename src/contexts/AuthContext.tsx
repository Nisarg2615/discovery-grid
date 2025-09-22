import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'scientist' | 'user';
}

interface Innovation {
  id: string;
  title: string;
  description: string;
  field: string;
  scientist_name: string;
  user_id: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  innovations: Innovation[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'scientist' | 'user') => Promise<boolean>;
  logout: () => void;
  submitInnovation: (innovation: Omit<Innovation, 'id' | 'created_at' | 'user_id' | 'scientist_name'>) => void;
  searchInnovations: (keyword: string) => Innovation[];
  getAllInnovations: () => Innovation[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demonstration
const mockUsers: (User & { password: string })[] = [
  { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@example.com', password: 'password', role: 'scientist' },
  { id: '2', name: 'John Explorer', email: 'john@example.com', password: 'password', role: 'user' },
];

const mockInnovations: Innovation[] = [
  {
    id: '1',
    title: 'Quantum Computing Algorithm',
    description: 'Revolutionary quantum algorithm for optimization problems',
    field: 'Computer Science',
    scientist_name: 'Dr. Sarah Johnson',
    user_id: '1',
    created_at: '2024-01-15'
  },
  {
    id: '2',
    title: 'Biodegradable Plastic Alternative',
    description: 'New material from algae that decomposes in 30 days',
    field: 'Materials Science',
    scientist_name: 'Dr. Sarah Johnson',
    user_id: '1',
    created_at: '2024-01-10'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [innovations, setInnovations] = useState<Innovation[]>(mockInnovations);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, role: 'scientist' | 'user'): Promise<boolean> => {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role
    };
    
    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const submitInnovation = (innovation: Omit<Innovation, 'id' | 'created_at' | 'user_id' | 'scientist_name'>) => {
    if (!user) return;
    
    const newInnovation: Innovation = {
      ...innovation,
      id: Date.now().toString(),
      created_at: new Date().toISOString().split('T')[0],
      user_id: user.id,
      scientist_name: user.name
    };
    
    setInnovations(prev => [newInnovation, ...prev]);
  };

  const searchInnovations = (keyword: string): Innovation[] => {
    const lowercaseKeyword = keyword.toLowerCase();
    return innovations.filter(
      innovation =>
        innovation.title.toLowerCase().includes(lowercaseKeyword) ||
        innovation.description.toLowerCase().includes(lowercaseKeyword) ||
        innovation.field.toLowerCase().includes(lowercaseKeyword)
    );
  };

  const getAllInnovations = () => innovations;

  return (
    <AuthContext.Provider value={{
      user,
      innovations,
      login,
      register,
      logout,
      submitInnovation,
      searchInnovations,
      getAllInnovations
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};