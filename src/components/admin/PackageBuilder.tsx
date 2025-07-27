import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
  Package, 
  Plus, 
  Minus, 
  Search,
  DollarSign,
  Percent,
  Calculator,
  Trash2,
  Copy
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Product, PackageItem } from '@/context/AppContext';

interface PackageBuilderProps {
  data?: any;
  onDataChange?: (data: any) => void;
  isEditing?: boolean;
}

const PackageBuilder: React.FC<PackageBuilderProps> = ({
  data = {},
  onDataChange,
  isEditing = false
}) => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [packageData, setPackageData] = useState({
    name: '',
    description: '',
    items: [] as PackageItem[],
    discountType: 'percentage' as 'percentage' | 'fixed' | 'tiered',
    discountValue: 0,
    minValue: undefined as number | undefined,
    maxValue: undefined as number | undefined,
    isActive: true,
    availabilityRules: {
      startDate: '',
      endDate: '',
      regions: [] as string[],
      clientTypes: [] as string[]
    },
    ...data
  });

  useEffect(() => {
    onDataChange?.(packageData);
  }, [packageData, onDataChange]);

  const filteredProducts = state.products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculatePackagePrice = () => {
    const subtotal = packageData.items.reduce((total, item) => {
      const product = state.products.find(p => p.id === item.productId);
      if (!product) return total;
      
      const itemPrice = item.customPrice || product.basePrice;
      return total + (itemPrice * item.quantity);
    }, 0);

    let discount = 0;
    if (packageData.discountType === 'percentage') {
      discount = subtotal * (packageData.discountValue / 100);
    } else if (packageData.discountType === 'fixed') {
      discount = packageData.discountValue;
    }

    return {
      subtotal,
      discount,
      total: Math.max(0, subtotal - discount)
    };
  };

  const addProductToPackage = (product: Product) => {
    const existingItem = packageData.items.find(item => item.productId === product.id);
    
    if (existingItem) {
      updatePackageItem(product.id, { quantity: existingItem.quantity + 1 });
    } else {
      const newItem: PackageItem = {
        productId: product.id,
        quantity: 1,
        isOptional: false
      };
      
      setPackageData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    }
  };

  const removeProductFromPackage = (productId: number) => {
    setPackageData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== productId)
    }));
  };

  const updatePackageItem = (productId: number, updates: Partial<PackageItem>) => {
    setPackageData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId === productId ? { ...item, ...updates } : item
      )
    }));
  };

  const updateBasicInfo = (field: string, value: any) => {
    setPackageData(prev => ({ ...prev, [field]: value }));
  };

  const pricing = calculatePackagePrice();

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Package Information
          </CardTitle>
          <CardDescription>Basic details about your package</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="packageName">Package Name</Label>
              <Input
                id="packageName"
                value={packageData.name}
                onChange={(e) => updateBasicInfo('name', e.target.value)}
                placeholder="Enter package name"
              />
            </div>
            <div>
              <Label htmlFor="packageActive">Status</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  id="packageActive"
                  checked={packageData.isActive}
                  onCheckedChange={(checked) => updateBasicInfo('isActive', checked)}
                />
                <Label htmlFor="packageActive">
                  {packageData.isActive ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="packageDescription">Description</Label>
            <Textarea
              id="packageDescription"
              value={packageData.description}
              onChange={(e) => updateBasicInfo('description', e.target.value)}
              placeholder="Describe what this package includes"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Products */}
        <Card>
          <CardHeader>
            <CardTitle>Available Products</CardTitle>
            <CardDescription>Search and add products to your package</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">${product.basePrice}</Badge>
                        <Badge variant="outline">{product.unit}</Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addProductToPackage(product)}
                      disabled={packageData.items.some(item => item.productId === product.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Package Items */}
        <Card>
          <CardHeader>
            <CardTitle>Package Items</CardTitle>
            <CardDescription>Configure products in this package</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {packageData.items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No products added yet</p>
                  <p className="text-sm">Add products from the left panel</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {packageData.items.map(item => {
                    const product = state.products.find(p => p.id === item.productId);
                    if (!product) return null;

                    return (
                      <div key={item.productId} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeProductFromPackage(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Quantity</Label>
                            <div className="flex items-center space-x-1 mt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updatePackageItem(product.id, { 
                                  quantity: Math.max(1, item.quantity - 1) 
                                })}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updatePackageItem(product.id, { 
                                  quantity: Math.max(1, parseInt(e.target.value) || 1) 
                                })}
                                className="text-center w-16"
                                min="1"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updatePackageItem(product.id, { 
                                  quantity: item.quantity + 1 
                                })}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Custom Price (Optional)</Label>
                            <Input
                              type="number"
                              placeholder={`Default: $${product.basePrice}`}
                              value={item.customPrice || ''}
                              onChange={(e) => updatePackageItem(product.id, { 
                                customPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                              })}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-3">
                          <Checkbox
                            id={`optional-${item.productId}`}
                            checked={item.isOptional}
                            onCheckedChange={(checked) => updatePackageItem(product.id, { 
                              isOptional: checked as boolean 
                            })}
                          />
                          <Label htmlFor={`optional-${item.productId}`} className="text-sm">
                            Optional item
                          </Label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Pricing & Discounts
          </CardTitle>
          <CardDescription>Configure package pricing and discount rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={packageData.discountType}
                onValueChange={(value) => updateBasicInfo('discountType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Percentage
                    </div>
                  </SelectItem>
                  <SelectItem value="fixed">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Fixed Amount
                    </div>
                  </SelectItem>
                  <SelectItem value="tiered">
                    <div className="flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      Tiered
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="discountValue">
                Discount Value ({packageData.discountType === 'percentage' ? '%' : '$'})
              </Label>
              <Input
                id="discountValue"
                type="number"
                value={packageData.discountValue}
                onChange={(e) => updateBasicInfo('discountValue', parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
                max={packageData.discountType === 'percentage' ? 100 : undefined}
              />
            </div>
            
            <div>
              <Label>Package Limits</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Min value"
                  value={packageData.minValue || ''}
                  onChange={(e) => updateBasicInfo('minValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder="Max value"
                  value={packageData.maxValue || ''}
                  onChange={(e) => updateBasicInfo('maxValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>

          {/* Price Preview */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">${pricing.subtotal.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Subtotal</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">-${pricing.discount.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Discount</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">${pricing.total.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Final Price</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageBuilder;