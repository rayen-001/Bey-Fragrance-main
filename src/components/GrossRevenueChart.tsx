import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsApi } from '../lib/api';

interface Order {
  id: string;
  status: string;
  totalPrice?: number;
}

export function GrossRevenueChart({ orders = [] }: { orders?: Order[] }) {
  const [range, setRange] = useState<'month' | 'six_months' | 'all'>('month');
  const [data, setData] = useState<{ date: string; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await analyticsApi.getGrossRevenue(range);
        setData(result);
      } catch (e) {
        console.error('Failed to fetch gross revenue:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range, orders.length]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-sm p-6 mb-8 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl text-white font-serif">Gross Revenue</h3>
          <p className="text-white/50 text-sm mt-1">Total revenue from paid and completed orders.</p>
        </div>
        <div className="flex bg-black/40 rounded-sm overflow-hidden p-1 border border-white/10">
          {[
            { id: 'month', label: 'This Month' },
            { id: 'six_months', label: 'Last 6 Months' },
            { id: 'all', label: 'All Time' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRange(tab.id as any)}
              className={`px-4 py-1.5 text-sm transition-colors rounded-sm ${
                range === tab.id
                  ? 'bg-[#d4af37] text-black font-medium'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[350px] w-full mt-4">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-white/5 rounded-sm border border-white/5 animate-pulse">
            <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading revenue data...
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-white/5 rounded-sm border border-white/5">
            <span className="text-4xl mb-4 opacity-50">📉</span>
            No revenue data for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart 
              data={data} 
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              key={`chart-${data.length}`}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#fff" 
                opacity={0.5} 
                tick={{ fill: '#fff', opacity: 0.5, fontSize: 12 }}
                tickMargin={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#fff" 
                opacity={0.5} 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fill: '#fff', opacity: 0.5, fontSize: 12 }}
                tickMargin={12}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #d4af37', borderRadius: '4px', color: '#fff' }}
                itemStyle={{ color: '#d4af37' }}
                cursor={{ stroke: '#d4af37', strokeWidth: 1 }}
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                labelStyle={{ color: '#fff', opacity: 0.7, marginBottom: '8px' }}
              />
              <Area 
                type="monotone"
                dataKey="revenue" 
                stroke="#d4af37" 
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                dot={{ fill: '#0a0a0a', stroke: '#d4af37', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#d4af37', stroke: '#fff', strokeWidth: 2 }}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
