import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Calculator, 
  Home, 
  Settings, 
  User,
  BarChart3,
  FileText,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Calculator', href: '/calculator', icon: Calculator },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Quotes', href: '/quotes/new', icon: FileText },
    { name: 'Admin', href: '/admin', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className={cn('md:hidden', className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="mobile-touch-target"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 animate-slide-in-left">
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="flex items-center gap-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              PriceCalc Pro
            </SheetTitle>
          </SheetHeader>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 mobile-touch-target',
                    active 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                  {active && (
                    <Badge variant="secondary" className="ml-auto">
                      Active
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <Link to="/auth" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full mobile-button">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            
            <div className="text-xs text-muted-foreground text-center">
              © 2024 PriceCalc Pro
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}