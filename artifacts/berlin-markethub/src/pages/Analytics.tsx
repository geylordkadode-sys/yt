import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, Users, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const REVENUE_DATA = [
  { name: 'Mon', revenue: 400 },
  { name: 'Tue', revenue: 300 },
  { name: 'Wed', revenue: 550 },
  { name: 'Thu', revenue: 450 },
  { name: 'Fri', revenue: 700 },
  { name: 'Sat', revenue: 900 },
  { name: 'Sun', revenue: 850 },
];

const CATEGORY_DATA = [
  { name: 'Women', value: 400, color: '#E91E8C' },
  { name: 'Men', value: 300, color: '#FF6B6B' },
  { name: 'Vintage', value: 300, color: '#FFB6B9' },
  { name: 'Accessories', value: 200, color: '#FF8787' },
];

export default function Analytics() {
  return (
    <AppLayout showNav={false}>
      <Header title="Analytics Dashboard" showBack />
      
      <div className="p-4 bg-background pb-8">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold">$4,250</h3>
              <div className="flex items-center text-xs text-green-500 font-medium mt-1">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12.5%
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
                <Package className="w-4 h-4" />
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Orders</p>
              <h3 className="text-2xl font-bold">124</h3>
              <div className="flex items-center text-xs text-green-500 font-medium mt-1">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> 8.2%
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mb-2">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Conversion</p>
              <h3 className="text-2xl font-bold">4.8%</h3>
              <div className="flex items-center text-xs text-rose-500 font-medium mt-1">
                <ArrowDownRight className="w-3 h-3 mr-0.5" /> 1.2%
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Response Time</p>
              <h3 className="text-2xl font-bold">2.4h</h3>
              <div className="flex items-center text-xs text-green-500 font-medium mt-1">
                <ArrowDownRight className="w-3 h-3 mr-0.5" /> Better
              </div>
            </CardContent>
          </Card>
        </div>

        <h3 className="font-bold text-lg mb-3">Revenue (This Week)</h3>
        <Card className="rounded-3xl border-border shadow-sm p-4 mb-6">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E91E8C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E91E8C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#E91E8C', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E91E8C" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <h3 className="font-bold text-lg mb-3">Top Categories</h3>
        <Card className="rounded-3xl border-border shadow-sm p-4">
          <div className="flex items-center">
            <div className="h-[200px] w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 flex flex-col gap-3 pl-4">
              {CATEGORY_DATA.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{Math.round((cat.value / 1200) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}