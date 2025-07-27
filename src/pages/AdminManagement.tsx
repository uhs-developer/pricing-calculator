import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Settings, 
  Package, 
  DollarSign, 
  Users, 
  BarChart,
  Plus,
  Edit,
  Trash2,
  Globe,
  Shield
} from 'lucide-react';
import AdvancedTable from '@/components/admin/AdvancedTable';
import FormWizard from '@/components/admin/FormWizard';
import PackageBuilder from '@/components/admin/PackageBuilder';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import { Product, Package as PackageType, User, PricingRule } from '@/context/AppContext';

const AdminManagement = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { toast } = useToast();
  const [showWizard, setShowWizard] = useState(false);
  const [wizardType, setWizardType] = useState<'product' | 'package' | 'user'>('product');

  // Product table columns
  const productColumns = [
    { key: 'name', label: 'Name', sortable: true, filterable: true },
    { key: 'category', label: 'Category', sortable: true, filterable: true },
    { 
      key: 'basePrice', 
      label: 'Price', 
      sortable: true,
      render: (value: number) => <Badge variant="secondary">${value}</Badge>
    },
    { key: 'unit', label: 'Unit', sortable: true },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    { 
      key: 'revenue', 
      label: 'Revenue', 
      sortable: true,
      render: (value: number) => <span className="font-medium">${value.toLocaleString()}</span>
    }
  ];

  // Package table columns
  const packageColumns = [
    { key: 'name', label: 'Name', sortable: true, filterable: true },
    { key: 'description', label: 'Description', filterable: true },
    { 
      key: 'discountValue', 
      label: 'Discount',
      render: (value: number, row: PackageType) => (
        <Badge variant="outline">
          {row.discountType === 'percentage' ? `${value}%` : `$${value}`}
        </Badge>
      )
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  // User table columns
  const userColumns = [
    { key: 'name', label: 'Name', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { 
      key: 'role', 
      label: 'Role', 
      sortable: true,
      render: (value: string) => <Badge variant="outline">{value}</Badge>
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    }
  ];

  const handleEdit = (item: any) => {
    toast({ title: "Edit functionality", description: "Edit feature would open here" });
  };

  const handleDelete = (item: any) => {
    toast({ title: "Delete confirmation", description: "Delete confirmation would appear here" });
  };

  const handleWizardComplete = (data: any) => {
    toast({ title: "Success", description: `${wizardType} created successfully!` });
    setShowWizard(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Admin Management</span>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Product Management</h2>
                <p className="text-muted-foreground">Manage your product catalog and pricing</p>
              </div>
              <Button onClick={() => { setWizardType('product'); setShowWizard(true); }} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
            <AdvancedTable
              data={state.products}
              columns={productColumns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              selectable={true}
              searchable={true}
              filterable={true}
              exportable={true}
            />
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Package Management</h2>
                <p className="text-muted-foreground">Create and manage service bundles</p>
              </div>
              <Button onClick={() => { setWizardType('package'); setShowWizard(true); }} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Package
              </Button>
            </div>
            <AdvancedTable
              data={state.packages}
              columns={packageColumns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              selectable={true}
              searchable={true}
              filterable={true}
              exportable={true}
            />
          </TabsContent>

          {/* Pricing Rules Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Pricing Rules</h2>
                <p className="text-muted-foreground">Configure dynamic pricing and multipliers</p>
              </div>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.pricingRules.map(rule => (
                <Card key={rule.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {rule.name}
                      <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {rule.type.replace('_', ' ').toUpperCase()} • {rule.multiplier}x multiplier
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Priority: {rule.priority}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(rule)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(rule)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-muted-foreground">Manage team members and permissions</p>
              </div>
              <Button onClick={() => { setWizardType('user'); setShowWizard(true); }} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
            <AdvancedTable
              data={state.users}
              columns={userColumns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              selectable={true}
              searchable={true}
              filterable={true}
              exportable={true}
            />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Form Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <FormWizard
              title={`Create New ${wizardType.charAt(0).toUpperCase() + wizardType.slice(1)}`}
              steps={[
                {
                  id: 'info',
                  title: 'Basic Information',
                  description: `Enter ${wizardType} details`,
                  component: wizardType === 'package' ? <PackageBuilder /> : <div className="p-8 text-center">Form component for {wizardType}</div>
                }
              ]}
              onComplete={handleWizardComplete}
              onCancel={() => setShowWizard(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
