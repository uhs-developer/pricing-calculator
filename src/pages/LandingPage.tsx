import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/ui/mobile-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  CheckCircle, 
  DollarSign, 
  Globe, 
  Mail, 
  Phone, 
  Zap, 
  Shield,
  Users,
  TrendingUp
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [calculatorData, setCalculatorData] = useState({
    projectType: '',
    budget: '',
    timeline: ''
  });

  const handleQuickCalculate = () => {
    navigate('/calculator', { state: calculatorData });
  };

  const features = [
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Instant Pricing",
      description: "Get accurate pricing estimates in seconds with our intelligent calculator"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Rates",
      description: "Automatic regional pricing adjustments for international projects"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Professional Quotes",
      description: "Generate beautiful, branded quotations with detailed breakdowns"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Smart Analytics",
      description: "Track conversion rates and optimize your pricing strategy"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Sales Manager",
      company: "TechCorp",
      quote: "Cut our quotation time from 2 hours to 15 minutes. Game changer!"
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      company: "StartupXYZ",
      quote: "Professional quotes that actually convert. Our close rate improved 40%."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">PriceCalc Pro</span>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/calculator" className="text-muted-foreground hover:text-foreground transition-quick">
                  Calculator
                </Link>
                <Link to="#features" className="text-muted-foreground hover:text-foreground transition-quick">
                  Features
                </Link>
                <Link to="#contact" className="text-muted-foreground hover:text-foreground transition-quick">
                  Contact
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
              </nav>
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              ✨ New: AI-Powered Pricing Engine
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Get Instant Pricing for Your Project
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional quotation system that streamlines your sales process. 
              Create accurate estimates in minutes, not hours.
            </p>
            
            {/* Quick Calculator Widget */}
            <Card className="max-w-2xl mx-auto mb-8 shadow-custom-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Price Estimate
                </CardTitle>
                <CardDescription>
                  Get started with a rough estimate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={calculatorData.projectType} onValueChange={(value) => 
                    setCalculatorData(prev => ({ ...prev, projectType: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Project Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Business Website</SelectItem>
                      <SelectItem value="ecommerce">E-commerce Store</SelectItem>
                      <SelectItem value="mobile">Mobile App</SelectItem>
                      <SelectItem value="custom">Custom Software</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={calculatorData.budget} onValueChange={(value) => 
                    setCalculatorData(prev => ({ ...prev, budget: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Budget Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5k">$5K - $10K</SelectItem>
                      <SelectItem value="10k">$10K - $25K</SelectItem>
                      <SelectItem value="25k">$25K - $50K</SelectItem>
                      <SelectItem value="50k">$50K+</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={calculatorData.timeline} onValueChange={(value) => 
                    setCalculatorData(prev => ({ ...prev, timeline: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rush">Rush (2-4 weeks)</SelectItem>
                      <SelectItem value="standard">Standard (6-8 weeks)</SelectItem>
                      <SelectItem value="flexible">Flexible (3+ months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleQuickCalculate} 
                    className="mobile-button btn-primary hover-scale animate-fade-in"
                    size="lg"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Pricing
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/calculator')}
                    className="mobile-button hover-scale animate-fade-in"
                    size="lg"
                  >
                    Detailed Calculator
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-accent" />
                No registration required
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-accent" />
                Instant results
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-accent" />
                Professional quotes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to price professionally
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline your sales process with intelligent pricing tools designed for modern businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="card-hover border-0 shadow-custom-md animate-fade-in hover-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center">
                  <div className="bg-primary-light p-3 rounded-lg w-fit mx-auto mb-4 hover-scale">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by growing businesses
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of companies that have streamlined their pricing process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">80%</div>
              <div className="opacity-90">Time Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">45%</div>
              <div className="opacity-90">Higher Conversion</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15min</div>
              <div className="opacity-90">Average Quote Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="opacity-90">Pricing Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What our customers say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-custom-md">
                <CardContent className="pt-6">
                  <p className="text-lg mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-light p-2 rounded-full">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your pricing process?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Start creating professional quotations today. No setup fees, no long-term contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate('/calculator')}
              className="mobile-button hover-scale animate-bounce-in"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Try Calculator Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary mobile-button hover-scale animate-bounce-in"
              style={{ animationDelay: '0.2s' }}
            >
              <Mail className="h-5 w-5 mr-2" />
              Request Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-muted py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">PriceCalc Pro</span>
              </div>
              <p className="text-muted-foreground">
                Professional pricing calculator for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Features</div>
                <div>Pricing</div>
                <div>API</div>
                <div>Documentation</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  hello@pricecalc.pro
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +1 (555) 123-4567
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 PriceCalc Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;