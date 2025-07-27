import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin' | 'manager' | 'sales_rep' | 'viewer';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  teamId?: string;
  avatar?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  unit: 'hour' | 'project' | 'month' | 'piece' | 'day' | 'year' | 'custom';
  basePrice: number;
  currency: string;
  isActive: boolean;
  tags: string[];
  images?: string[];
  attributes?: { [key: string]: any };
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  revenue: number;
}

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  attributes: CategoryAttribute[];
  isActive: boolean;
}

interface CategoryAttribute {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'date';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

interface PricingRule {
  id: string;
  name: string;
  type: 'geographic' | 'client_type' | 'urgency' | 'volume' | 'seasonal' | 'complexity';
  isActive: boolean;
  priority: number;
  conditions: PricingCondition[];
  multiplier: number;
  createdAt: string;
  updatedAt: string;
}

interface PricingCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
  value: any;
}

interface CurrencyRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
  isManualOverride: boolean;
  source: 'api' | 'manual';
}

interface UserPermission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface AnalyticsEvent {
  id: string;
  type: string;
  userId: string;
  metadata: { [key: string]: any };
  timestamp: string;
}

interface PackageTemplate {
  id: string;
  name: string;
  description: string;
  items: PackageItem[];
  isDefault: boolean;
}

interface QuotationItem {
  id: string;
  type: 'product' | 'package' | 'custom';
  productId?: number;
  packageId?: number;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Quotation {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  items: QuotationItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  createdAt: string;
  validUntil: string;
  notes?: string;
}

interface PackageItem {
  productId: number;
  quantity: number;
  isOptional: boolean;
  customPrice?: number;
}

interface Package {
  id: number;
  name: string;
  description: string;
  items: PackageItem[];
  discountType: 'percentage' | 'fixed' | 'tiered';
  discountValue: number;
  minValue?: number;
  maxValue?: number;
  isActive: boolean;
  availabilityRules?: {
    startDate?: string;
    endDate?: string;
    regions?: string[];
    clientTypes?: string[];
  };
  version: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  revenue: number;
  templates?: string[];
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  products: Product[];
  packages: Package[];
  quotations: Quotation[];
  currentQuotation: Quotation | null;
  productCategories: ProductCategory[];
  pricingRules: PricingRule[];
  currencyRates: CurrencyRate[];
  userPermissions: UserPermission[];
  users: User[];
  analyticsEvents: AnalyticsEvent[];
  packageTemplates: PackageTemplate[];
  calculatorState: {
    selectedItems: any[];
    multipliers: Record<string, number>;
    currency: string;
    total: number;
  };
  ui: {
    sidebarOpen: boolean;
    notifications: any[];
    theme: 'light' | 'dark';
    loading: boolean;
  };
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: number }
  | { type: 'SET_PACKAGES'; payload: Package[] }
  | { type: 'ADD_PACKAGE'; payload: Package }
  | { type: 'UPDATE_PACKAGE'; payload: Package }
  | { type: 'DELETE_PACKAGE'; payload: number }
  | { type: 'SET_QUOTATIONS'; payload: Quotation[] }
  | { type: 'SET_CURRENT_QUOTATION'; payload: Quotation | null }
  | { type: 'SET_PRODUCT_CATEGORIES'; payload: ProductCategory[] }
  | { type: 'SET_PRICING_RULES'; payload: PricingRule[] }
  | { type: 'SET_CURRENCY_RATES'; payload: CurrencyRate[] }
  | { type: 'SET_USER_PERMISSIONS'; payload: UserPermission[] }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_ANALYTICS_EVENTS'; payload: AnalyticsEvent[] }
  | { type: 'SET_PACKAGE_TEMPLATES'; payload: PackageTemplate[] }
  | { type: 'UPDATE_CALCULATOR'; payload: Partial<AppState['calculatorState']> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ADD_NOTIFICATION'; payload: any }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  products: [],
  packages: [],
  quotations: [],
  currentQuotation: null,
  productCategories: [],
  pricingRules: [],
  currencyRates: [],
  userPermissions: [],
  users: [],
  analyticsEvents: [],
  packageTemplates: [],
  calculatorState: {
    selectedItems: [],
    multipliers: {},
    currency: 'USD',
    total: 0
  },
  ui: {
    sidebarOpen: false,
    notifications: [],
    theme: 'light',
    loading: false
  }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    case 'SET_PACKAGES':
      return { ...state, packages: action.payload };
    case 'ADD_PACKAGE':
      return { ...state, packages: [...state.packages, action.payload] };
    case 'UPDATE_PACKAGE':
      return {
        ...state,
        packages: state.packages.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PACKAGE':
      return { ...state, packages: state.packages.filter(p => p.id !== action.payload) };
    case 'SET_QUOTATIONS':
      return { ...state, quotations: action.payload };
    case 'SET_CURRENT_QUOTATION':
      return { ...state, currentQuotation: action.payload };
    case 'SET_PRODUCT_CATEGORIES':
      return { ...state, productCategories: action.payload };
    case 'SET_PRICING_RULES':
      return { ...state, pricingRules: action.payload };
    case 'SET_CURRENCY_RATES':
      return { ...state, currencyRates: action.payload };
    case 'SET_USER_PERMISSIONS':
      return { ...state, userPermissions: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_ANALYTICS_EVENTS':
      return { ...state, analyticsEvents: action.payload };
    case 'SET_PACKAGE_TEMPLATES':
      return { ...state, packageTemplates: action.payload };
    case 'UPDATE_CALCULATOR':
      return {
        ...state,
        calculatorState: { ...state.calculatorState, ...action.payload }
      };
    case 'SET_LOADING':
      return { ...state, ui: { ...state.ui, loading: action.payload } };
    case 'TOGGLE_SIDEBAR':
      return { ...state, ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen } };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        ui: { ...state.ui, notifications: [...state.ui.notifications, action.payload] }
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== action.payload)
        }
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load mock data on app start
  useEffect(() => {
    // Check for existing auth
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const { user, token } = JSON.parse(savedAuth);
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    }

    // Load mock data
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock product categories
    const mockCategories: ProductCategory[] = [
      {
        id: '1',
        name: 'Web Development',
        description: 'Web development services',
        attributes: [
          { id: '1', name: 'Technology Stack', type: 'select', required: true, options: ['React', 'Vue', 'Angular', 'Vanilla JS'] },
          { id: '2', name: 'Responsive Design', type: 'boolean', required: true }
        ],
        isActive: true
      },
      {
        id: '2',
        name: 'E-commerce',
        description: 'E-commerce solutions',
        attributes: [
          { id: '3', name: 'Platform', type: 'select', required: true, options: ['Shopify', 'WooCommerce', 'Custom'] },
          { id: '4', name: 'Payment Integration', type: 'boolean', required: true }
        ],
        isActive: true
      },
      {
        id: '3',
        name: 'Digital Marketing',
        description: 'Digital marketing services',
        attributes: [
          { id: '5', name: 'Campaign Duration', type: 'number', required: true },
          { id: '6', name: 'Target Audience', type: 'text', required: true }
        ],
        isActive: true
      }
    ];

    // Mock products
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Website Design',
        description: 'Custom website design with modern UI/UX',
        category: 'Web Development',
        unit: 'project',
        basePrice: 2500,
        currency: 'USD',
        isActive: true,
        tags: ['design', 'ui', 'ux'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        usageCount: 45,
        revenue: 112500
      },
      {
        id: 2,
        name: 'Frontend Development',
        description: 'React/Vue frontend development',
        category: 'Web Development',
        unit: 'hour',
        basePrice: 85,
        currency: 'USD',
        isActive: true,
        tags: ['react', 'vue', 'frontend'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        usageCount: 120,
        revenue: 10200
      },
      {
        id: 3,
        name: 'Backend Development',
        description: 'Node.js/Laravel backend development',
        category: 'Web Development',
        unit: 'hour',
        basePrice: 95,
        currency: 'USD',
        isActive: true,
        tags: ['nodejs', 'laravel', 'backend'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        usageCount: 85,
        revenue: 8075
      },
      {
        id: 4,
        name: 'E-commerce Setup',
        description: 'Complete e-commerce platform setup',
        category: 'E-commerce',
        unit: 'project',
        basePrice: 3500,
        currency: 'USD',
        isActive: true,
        tags: ['ecommerce', 'shop', 'payments'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        usageCount: 22,
        revenue: 77000
      },
      {
        id: 5,
        name: 'SEO Optimization',
        description: 'Complete SEO optimization and strategy',
        category: 'Digital Marketing',
        unit: 'project',
        basePrice: 800,
        currency: 'USD',
        isActive: true,
        tags: ['seo', 'marketing', 'optimization'],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        usageCount: 67,
        revenue: 53600
      }
    ];

    // Mock packages
    const mockPackages: Package[] = [
      {
        id: 1,
        name: 'Startup Website Package',
        description: 'Complete website solution for startups',
        items: [
          { productId: 1, quantity: 1, isOptional: false },
          { productId: 2, quantity: 40, isOptional: false },
          { productId: 5, quantity: 1, isOptional: true }
        ],
        discountType: 'percentage',
        discountValue: 15,
        isActive: true,
        version: '1.0',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        usageCount: 15,
        revenue: 48000
      },
      {
        id: 2,
        name: 'E-commerce Complete',
        description: 'Full e-commerce solution with marketing',
        items: [
          { productId: 1, quantity: 1, isOptional: false },
          { productId: 4, quantity: 1, isOptional: false },
          { productId: 5, quantity: 1, isOptional: false }
        ],
        discountType: 'percentage',
        discountValue: 20,
        isActive: true,
        version: '1.0',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        usageCount: 8,
        revenue: 52800
      }
    ];

    // Mock pricing rules
    const mockPricingRules: PricingRule[] = [
      {
        id: '1',
        name: 'US Market Premium',
        type: 'geographic',
        isActive: true,
        priority: 1,
        conditions: [{ field: 'country', operator: 'equals', value: 'US' }],
        multiplier: 1.2,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '2',
        name: 'Enterprise Client',
        type: 'client_type',
        isActive: true,
        priority: 2,
        conditions: [{ field: 'clientType', operator: 'equals', value: 'enterprise' }],
        multiplier: 1.5,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '3',
        name: 'Rush Order',
        type: 'urgency',
        isActive: true,
        priority: 3,
        conditions: [{ field: 'urgency', operator: 'equals', value: 'high' }],
        multiplier: 1.8,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ];

    // Mock currency rates
    const mockCurrencyRates: CurrencyRate[] = [
      {
        id: '1',
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        rate: 0.85,
        lastUpdated: '2024-01-01',
        isManualOverride: false,
        source: 'api'
      },
      {
        id: '2',
        fromCurrency: 'USD',
        toCurrency: 'GBP',
        rate: 0.75,
        lastUpdated: '2024-01-01',
        isManualOverride: false,
        source: 'api'
      }
    ];

    // Mock users
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Admin',
        email: 'admin@example.com',
        role: 'admin',
        permissions: ['manage_products', 'manage_users', 'view_analytics'],
        isActive: true,
        createdAt: '2024-01-01',
        lastLogin: '2024-01-15'
      },
      {
        id: '2',
        name: 'Jane Manager',
        email: 'manager@example.com',
        role: 'manager',
        permissions: ['manage_products', 'view_analytics'],
        isActive: true,
        createdAt: '2024-01-01',
        lastLogin: '2024-01-14'
      }
    ];

    dispatch({ type: 'SET_PRODUCT_CATEGORIES', payload: mockCategories });
    dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
    dispatch({ type: 'SET_PACKAGES', payload: mockPackages });
    dispatch({ type: 'SET_PRICING_RULES', payload: mockPricingRules });
    dispatch({ type: 'SET_CURRENCY_RATES', payload: mockCurrencyRates });
    dispatch({ type: 'SET_USERS', payload: mockUsers });
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export type { 
  User, 
  Product, 
  ProductCategory,
  CategoryAttribute,
  Quotation, 
  Package, 
  PackageItem,
  PackageTemplate,
  PricingRule,
  PricingCondition,
  CurrencyRate,
  UserPermission,
  AnalyticsEvent,
  AppState, 
  AppAction 
};