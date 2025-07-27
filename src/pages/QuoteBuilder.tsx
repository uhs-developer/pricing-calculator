import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Calculator, 
  Plus, 
  Save, 
  Send, 
  Eye,
  DollarSign,
  User
} from 'lucide-react';

const QuoteBuilder = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const [quoteData, setQuoteData] = useState({
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    items: [] as any[],
    notes: '',
    currency: 'USD'
  });

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const calculateTotal = () => {
    return selectedProducts.reduce((total, productId) => {
      const product = state.products.find(p => p.id === productId);
      return total + (product?.basePrice || 0);
    }, 0);
  };

  const handleAddProduct = (productId: number) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId));
  };

  const handleSaveQuote = () => {
    console.log('Saving quote:', { ...quoteData, products: selectedProducts, total: calculateTotal() });
    alert('Quote saved as draft!');
  };

  const handleSendQuote = () => {
    console.log('Sending quote:', { ...quoteData, products: selectedProducts, total: calculateTotal() });
    alert('Quote sent to client!');
    navigate('/dashboard');
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
              <Calculator className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Quote Builder</span>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <Card className="shadow-custom-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={quoteData.clientName}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={quoteData.clientEmail}
                      onChange={(e) => setQuoteData(prev => ({ ...prev, clientEmail: e.target.value }))}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="clientCompany">Company</Label>
                  <Input
                    id="clientCompany"
                    value={quoteData.clientCompany}
                    onChange={(e) => setQuoteData(prev => ({ ...prev, clientCompany: e.target.value }))}
                    placeholder="Company Name"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card className="shadow-custom-lg">
              <CardHeader>
                <CardTitle>Select Products & Services</CardTitle>
                <CardDescription>Choose items to include in this quotation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {state.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <p className="text-sm font-medium">${product.basePrice.toLocaleString()} per {product.unit}</p>
                      </div>
                      {selectedProducts.includes(product.id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleAddProduct(product.id)}
                          className="btn-primary"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="shadow-custom-lg">
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={quoteData.notes}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any special terms, conditions, or notes for this quote..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Quote Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-custom-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Quote Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {selectedProducts.map((productId) => {
                    const product = state.products.find(p => p.id === productId);
                    if (!product) return null;
                    return (
                      <div key={productId} className="flex justify-between text-sm">
                        <span className="truncate">{product.name}</span>
                        <span>${product.basePrice.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>

                {selectedProducts.length > 0 && (
                  <>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4">
                      <Button 
                        onClick={handleSaveQuote}
                        variant="outline" 
                        className="w-full"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button 
                        onClick={handleSendQuote}
                        className="w-full btn-accent"
                        disabled={!quoteData.clientName || !quoteData.clientEmail}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Quote
                      </Button>
                    </div>
                  </>
                )}

                {selectedProducts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select products to see pricing</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBuilder;