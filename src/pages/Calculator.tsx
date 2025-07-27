import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calculator as CalculatorIcon, 
  Check, 
  DollarSign,
  Globe,
  Mail,
  Download,
  Share
} from 'lucide-react';

interface CalculatorStep {
  id: number;
  title: string;
  description: string;
}

const steps: CalculatorStep[] = [
  { id: 1, title: 'Project Type', description: 'Select your project category' },
  { id: 2, title: 'Requirements', description: 'Define features and complexity' },
  { id: 3, title: 'Details', description: 'Location and business information' },
  { id: 4, title: 'Results', description: 'Your pricing estimate' }
];

const Calculator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    features: [] as string[],
    complexity: [5],
    timeline: '',
    country: 'US',
    clientType: 'smb',
    urgency: 'standard',
    budget: '',
    contactInfo: {
      name: '',
      email: '',
      company: '',
      phone: ''
    }
  });

  // Load data from landing page if available
  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({ ...prev, ...location.state }));
    }
  }, [location.state]);

  const projectTypes = [
    { id: 'website', name: 'Business Website', basePrice: 3500, features: ['Design', 'CMS', 'Responsive'] },
    { id: 'ecommerce', name: 'E-commerce Store', basePrice: 6500, features: ['Shopping Cart', 'Payments', 'Inventory'] },
    { id: 'mobile', name: 'Mobile App', basePrice: 8500, features: ['iOS/Android', 'Backend', 'API'] },
    { id: 'custom', name: 'Custom Software', basePrice: 12000, features: ['Custom Features', 'Integration', 'Support'] }
  ];

  const availableFeatures = [
    'User Authentication',
    'Payment Integration',
    'API Development',
    'Database Design',
    'Admin Dashboard',
    'Analytics Integration',
    'Email Marketing',
    'Social Media Integration',
    'Multi-language Support',
    'Third-party Integrations'
  ];

  const multipliers = {
    country: {
      'US': 1.0,
      'UK': 1.1,
      'CA': 1.05,
      'AU': 1.2,
      'DE': 1.15,
      'FR': 1.12,
      'IN': 0.6,
      'BR': 0.7
    },
    clientType: {
      'enterprise': 1.3,
      'smb': 1.0,
      'startup': 0.8,
      'nonprofit': 0.7
    },
    urgency: {
      'rush': 1.5,
      'standard': 1.0,
      'flexible': 0.9
    }
  };

  const calculatePrice = () => {
    const selectedProject = projectTypes.find(p => p.id === formData.projectType);
    if (!selectedProject) return { min: 0, max: 0, breakdown: {} };

    const basePrice = selectedProject.basePrice;
    const complexityMultiplier = formData.complexity[0] / 5; // 0.2 to 2.0
    const featuresCost = formData.features.length * 500;
    
    const subtotal = basePrice + featuresCost;
    const countryMultiplier = multipliers.country[formData.country as keyof typeof multipliers.country] || 1.0;
    const clientMultiplier = multipliers.clientType[formData.clientType as keyof typeof multipliers.clientType] || 1.0;
    const urgencyMultiplier = multipliers.urgency[formData.urgency as keyof typeof multipliers.urgency] || 1.0;
    
    const adjustedPrice = subtotal * complexityMultiplier * countryMultiplier * clientMultiplier * urgencyMultiplier;
    
    return {
      min: Math.round(adjustedPrice * 0.8),
      max: Math.round(adjustedPrice * 1.2),
      breakdown: {
        basePrice,
        featuresCost,
        complexityMultiplier,
        countryMultiplier,
        clientMultiplier,
        urgencyMultiplier,
        subtotal,
        adjustedPrice
      }
    };
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmitLead = () => {
    // In a real app, this would submit to your API
    console.log('Lead submitted:', { ...formData, pricing: calculatePrice() });
    // Simulate API call
    setTimeout(() => {
      alert('Thank you! We\'ll send you a detailed quote within 24 hours.');
    }, 1000);
  };

  const pricing = calculatePrice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-2">
              <CalculatorIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Pricing Calculator</span>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-custom-lg">
                <CardHeader>
                  <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                  <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Step 1: Project Type */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projectTypes.map((project) => (
                          <Card 
                            key={project.id}
                            className={`cursor-pointer transition-quick border-2 ${
                              formData.projectType === project.id 
                                ? 'border-primary bg-primary-light' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, projectType: project.id }))}
                          >
                            <CardContent className="p-4">
                              <h3 className="font-semibold mb-2">{project.name}</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                Starting from ${project.basePrice.toLocaleString()}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {project.features.map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Requirements */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <Label className="text-base font-semibold mb-4 block">
                          Select Additional Features
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {availableFeatures.map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                              <Checkbox
                                id={feature}
                                checked={formData.features.includes(feature)}
                                onCheckedChange={() => handleFeatureToggle(feature)}
                              />
                              <Label htmlFor={feature} className="text-sm font-normal">
                                {feature}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-semibold mb-4 block">
                          Project Complexity: {formData.complexity[0]}/10
                        </Label>
                        <Slider
                          value={formData.complexity}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, complexity: value }))}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Simple</span>
                          <span>Complex</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="timeline" className="text-base font-semibold">Timeline</Label>
                        <Select value={formData.timeline} onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, timeline: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                            <SelectItem value="6-8-weeks">6-8 weeks</SelectItem>
                            <SelectItem value="3-months">3+ months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Details */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="country" className="text-base font-semibold">Country</Label>
                          <Select value={formData.country} onValueChange={(value) => 
                            setFormData(prev => ({ ...prev, country: value }))
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="UK">United Kingdom</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="AU">Australia</SelectItem>
                              <SelectItem value="DE">Germany</SelectItem>
                              <SelectItem value="FR">France</SelectItem>
                              <SelectItem value="IN">India</SelectItem>
                              <SelectItem value="BR">Brazil</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="clientType" className="text-base font-semibold">Business Type</Label>
                          <Select value={formData.clientType} onValueChange={(value) => 
                            setFormData(prev => ({ ...prev, clientType: value }))
                          }>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                              <SelectItem value="smb">Small/Medium Business</SelectItem>
                              <SelectItem value="startup">Startup</SelectItem>
                              <SelectItem value="nonprofit">Non-profit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="urgency" className="text-base font-semibold">Project Urgency</Label>
                        <Select value={formData.urgency} onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, urgency: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rush">Rush (50% premium)</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="flexible">Flexible (10% discount)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Results & Contact */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="text-center py-8 bg-gradient-primary rounded-lg text-white">
                        <h3 className="text-2xl font-bold mb-2">Your Project Estimate</h3>
                        <div className="text-4xl font-bold">
                          ${pricing.min.toLocaleString()} - ${pricing.max.toLocaleString()}
                        </div>
                        <p className="mt-2 opacity-90">Based on your requirements</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-base font-semibold">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.contactInfo.name}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, name: e.target.value }
                            }))}
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.contactInfo.email}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, email: e.target.value }
                            }))}
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="company" className="text-base font-semibold">Company</Label>
                          <Input
                            id="company"
                            value={formData.contactInfo.company}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, company: e.target.value }
                            }))}
                            placeholder="Your company name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-base font-semibold">Phone (Optional)</Label>
                          <Input
                            id="phone"
                            value={formData.contactInfo.phone}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, phone: e.target.value }
                            }))}
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>

                      <Button 
                        onClick={handleSubmitLead} 
                        className="w-full btn-accent"
                        disabled={!formData.contactInfo.name || !formData.contactInfo.email}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Get Detailed Quote
                      </Button>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    
                    {currentStep < 4 ? (
                      <Button 
                        onClick={handleNext}
                        disabled={currentStep === 1 && !formData.projectType}
                        className="btn-primary"
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/')}
                      >
                        Start Over
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Preview Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-custom-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Price Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.projectType ? (
                    <>
                      <div className="text-center py-4 bg-gradient-secondary rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          ${pricing.min.toLocaleString()} - ${pricing.max.toLocaleString()}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Estimated range</p>
                      </div>

                      <Separator />

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Base Project</span>
                          <span>${pricing.breakdown.basePrice?.toLocaleString()}</span>
                        </div>
                        {formData.features.length > 0 && (
                          <div className="flex justify-between">
                            <span>Features ({formData.features.length})</span>
                            <span>+${pricing.breakdown.featuresCost?.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Complexity</span>
                          <span>{((pricing.breakdown.complexityMultiplier || 1) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location</span>
                          <span>{((pricing.breakdown.countryMultiplier || 1) * 100).toFixed(0)}%</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2 text-xs text-muted-foreground">
                        <p>✓ Professional project management</p>
                        <p>✓ Quality assurance testing</p>
                        <p>✓ 3 months support included</p>
                        <p>✓ Source code ownership</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalculatorIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Select a project type to see pricing</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;