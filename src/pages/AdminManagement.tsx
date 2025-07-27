import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Settings, 
  Package, 
  DollarSign, 
  Users, 
  BarChart,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

const AdminManagement = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    unit: 'project',
    basePrice: '',
    currency: 'USD'
  });

  const handleAddProduct = () => {
    console.log('Adding product:', newProduct);
    alert('Product added successfully!');
    setNewProduct({
      name: '',
      description: '',
      category: '',
      unit: 'project',
      basePrice: '',
      currency: 'USD'
    });
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Product */}
              <Card className="shadow-custom-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Product
                  </CardTitle>
                  <CardDescription>Create a new product or service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productDescription">Description</Label>
                    <Input
                      id="productDescription"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Product description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Web Development"
                      />
                    </div>
                    <div>
                      <Label htmlFor="basePrice">Base Price</Label>
                      <Input
                        id="basePrice"
                        type="number"
                        value={newProduct.basePrice}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, basePrice: e.target.value }))}
                        placeholder="1000"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddProduct} className="w-full btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Products */}
              <Card className="shadow-custom-lg">
                <CardHeader>
                  <CardTitle>Existing Products</CardTitle>
                  <CardDescription>Manage your product catalog</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">${product.basePrice}</Badge>
                            <Badge variant="outline">{product.unit}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages">
            <Card className="shadow-custom-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Service Packages
                </CardTitle>
                <CardDescription>Create and manage service bundles</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">Package management coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Rules Tab */}
          <TabsContent value="pricing">
            <Card className="shadow-custom-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Rules & Multipliers
                </CardTitle>
                <CardDescription>Configure pricing logic and regional adjustments</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">Pricing rules management coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="shadow-custom-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">User management coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="shadow-custom-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Analytics & Reports
                </CardTitle>
                <CardDescription>View system analytics and generate reports</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <BarChart className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminManagement;
