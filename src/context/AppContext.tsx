import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin' | 'manager' | 'sales_rep' | 'viewer';
  permissions: string[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  unit: 'hour' | 'project' | 'month' | 'piece' | 'day';
  basePrice: number;
  currency: string;
  isActive: boolean;
  tags: string[];
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

interface Package {
  id: number;
  name: string;
  description: string;
  items: { productId: number; quantity: number }[];
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  products: Product[];
  packages: Package[];
  quotations: Quotation[];
  currentQuotation: Quotation | null;
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
  | { type: 'SET_PACKAGES'; payload: Package[] }
  | { type: 'SET_QUOTATIONS'; payload: Quotation[] }
  | { type: 'SET_CURRENT_QUOTATION'; payload: Quotation | null }
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
    case 'SET_PACKAGES':
      return { ...state, packages: action.payload };
    case 'SET_QUOTATIONS':
      return { ...state, quotations: action.payload };
    case 'SET_CURRENT_QUOTATION':
      return { ...state, currentQuotation: action.payload };
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
        tags: ['design', 'ui', 'ux']
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
        tags: ['react', 'vue', 'frontend']
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
        tags: ['nodejs', 'laravel', 'backend']
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
        tags: ['ecommerce', 'shop', 'payments']
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
        tags: ['seo', 'marketing', 'optimization']
      }
    ];

    // Mock packages
    const mockPackages: Package[] = [
      {
        id: 1,
        name: 'Startup Website Package',
        description: 'Complete website solution for startups',
        items: [
          { productId: 1, quantity: 1 },
          { productId: 2, quantity: 40 },
          { productId: 5, quantity: 1 }
        ],
        discountType: 'percentage',
        discountValue: 15,
        isActive: true
      },
      {
        id: 2,
        name: 'E-commerce Complete',
        description: 'Full e-commerce solution with marketing',
        items: [
          { productId: 1, quantity: 1 },
          { productId: 4, quantity: 1 },
          { productId: 5, quantity: 1 }
        ],
        discountType: 'percentage',
        discountValue: 20,
        isActive: true
      }
    ];

    dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
    dispatch({ type: 'SET_PACKAGES', payload: mockPackages });
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

export type { User, Product, Quotation, Package, AppState, AppAction };