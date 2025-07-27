import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calculator, 
  LogOut, 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign,
  FileText,
  Settings
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    localStorage.removeItem('auth');
    navigate('/');
  };

  const metrics = [
    { title: 'Total Quotes', value: '24', icon: <FileText className="h-6 w-6" />, change: '+12%' },
    { title: 'Conversion Rate', value: '68%', icon: <TrendingUp className="h-6 w-6" />, change: '+5%' },
    { title: 'Revenue', value: '$45,200', icon: <DollarSign className="h-6 w-6" />, change: '+18%' },
    { title: 'Active Clients', value: '18', icon: <Users className="h-6 w-6" />, change: '+3%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {state.user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={() => navigate('/quotes/new')} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Quote
          </Button>
          <Button variant="outline" onClick={() => navigate('/calculator')}>
            <Calculator className="h-4 w-4 mr-2" />
            Calculator
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="shadow-custom-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm text-accent">{metric.change}</p>
                  </div>
                  <div className="text-primary">{metric.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="shadow-custom-lg">
          <CardHeader>
            <CardTitle>Recent Quotations</CardTitle>
            <CardDescription>Your latest pricing activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No recent quotations. Create your first quote to get started!</p>
              <Button 
                onClick={() => navigate('/quotes/new')} 
                className="mt-4 btn-primary"
              >
                Create Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;