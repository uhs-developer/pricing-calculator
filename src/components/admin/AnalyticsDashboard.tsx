import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  LineChart, 
  PieChart,
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Target,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, trend }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <div className="flex items-center mt-1">
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-accent mr-1" />
            ) : trend === 'down' ? (
              <TrendingDown className="h-4 w-4 text-destructive mr-1" />
            ) : null}
            <span className={`text-sm ${
              trend === 'up' ? 'text-accent' : 
              trend === 'down' ? 'text-destructive' : 
              'text-muted-foreground'
            }`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-muted-foreground ml-1">vs last month</span>
          </div>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const AnalyticsDashboard: React.FC = () => {
  const { state } = useApp();
  const [timeRange, setTimeRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Calculate metrics from current data
  const totalRevenue = state.products.reduce((sum, product) => sum + product.revenue, 0) +
                      state.packages.reduce((sum, pkg) => sum + pkg.revenue, 0);
  
  const totalQuotes = state.quotations.length;
  const activeProducts = state.products.filter(p => p.isActive).length;
  const activePackages = state.packages.filter(p => p.isActive).length;

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 12000, quotes: 45 },
    { month: 'Feb', revenue: 15000, quotes: 52 },
    { month: 'Mar', revenue: 18000, quotes: 61 },
    { month: 'Apr', revenue: 22000, quotes: 70 },
    { month: 'May', revenue: 19000, quotes: 58 },
    { month: 'Jun', revenue: 25000, quotes: 78 }
  ];

  const productPerformance = state.products
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(product => ({
      name: product.name,
      revenue: product.revenue,
      usage: product.usageCount
    }));

  const handleExport = () => {
    const csvContent = [
      'Metric,Value,Change',
      `Total Revenue,$${totalRevenue.toLocaleString()},+12.5%`,
      `Total Quotes,${totalQuotes},+8.3%`,
      `Active Products,${activeProducts},+5.2%`,
      `Active Packages,${activePackages},+15.7%`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-report.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Overview of your business performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change={12.5}
          trend="up"
          icon={<DollarSign className="h-6 w-6 text-primary" />}
        />
        <MetricCard
          title="Total Quotes"
          value={totalQuotes}
          change={8.3}
          trend="up"
          icon={<Target className="h-6 w-6 text-primary" />}
        />
        <MetricCard
          title="Active Products"
          value={activeProducts}
          change={5.2}
          trend="up"
          icon={<Package className="h-6 w-6 text-primary" />}
        />
        <MetricCard
          title="Conversion Rate"
          value="65.4%"
          change={-2.1}
          trend="down"
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
        />
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">Revenue Chart</p>
                    <p className="text-sm text-muted-foreground">Chart component would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quote Success Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Quote Success Rate
                </CardTitle>
                <CardDescription>Breakdown of quote statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-accent rounded-full"></div>
                      <span className="text-sm">Approved</span>
                    </div>
                    <Badge variant="secondary">65.4%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-muted rounded-full"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <Badge variant="secondary">20.1%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-destructive rounded-full"></div>
                      <span className="text-sm">Rejected</span>
                    </div>
                    <Badge variant="secondary">14.5%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Top performing products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformance.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.usage} uses</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${product.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quote Volume</CardTitle>
                <CardDescription>Number of quotes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">Quote Volume Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Quote Value</CardTitle>
                <CardDescription>Trends in quote values</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">$12,450</div>
                    <div className="text-sm text-muted-foreground">Average Quote Value</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-accent">$8,200</div>
                      <div className="text-xs text-muted-foreground">Minimum</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-primary">$28,900</div>
                      <div className="text-xs text-muted-foreground">Maximum</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Performance Insights</CardTitle>
              <CardDescription>Key insights and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium text-accent">Growth Opportunity</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your e-commerce packages are showing 40% higher conversion rates. 
                        Consider expanding this offering.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary">Pricing Optimization</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Backend development services have low conversion at current pricing. 
                        Consider adjusting multipliers for different regions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted border rounded-lg">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Team Performance</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Top performing sales rep: Jane Manager with 78% conversion rate.
                        Consider sharing best practices with the team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;