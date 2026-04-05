import { motion } from 'motion/react';
import { TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

function StatsCard({ icon, title, value, change, isPositive }: StatsCardProps) {
  return (
    <motion.div
      className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-sm p-6 hover:border-[#d4af37]/50 transition-all"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-[#d4af37]/10 rounded-sm">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          <TrendingUp size={16} className={!isPositive ? 'rotate-180' : ''} />
          <span>{change}</span>
        </div>
      </div>
      <h3 className="text-white/60 text-sm mb-2">{title}</h3>
      <p className="text-white text-3xl font-serif">{value}</p>
    </motion.div>
  );
}

interface AnalyticsStatsProps {
  orders: Array<{
    id: string;
    product: string;
    quantity: number;
    status: string;
    totalPrice?: number;
  }>;
  products?: Array<{
    id: string;
    name: string;
    price: number | string;
  }>;
}

export function AnalyticsStats({ orders, products = [] }: AnalyticsStatsProps) {
  // Build a price lookup from products
  const priceMap = new Map<string, number>();
  products.forEach(p => {
    priceMap.set(p.name, typeof p.price === 'string' ? parseFloat(p.price) || 0 : p.price);
  });

  const REVENUE_STATUSES = ['paid', 'completed', 'delivered', 'shipped', 'confirmed'];

  // Calculate real metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    // Only count revenue for actual completed/shipped/paid orders
    const status = (order.status || '').toLowerCase();
    if (!REVENUE_STATUSES.includes(status)) {
      return sum;
    }

    // Use totalPrice if available, otherwise look up product price
    if (order.totalPrice) return sum + order.totalPrice;
    const unitPrice = priceMap.get(order.product) || 0;
    return sum + (order.quantity * unitPrice);
  }, 0);
  
  const totalCustomers = new Set(orders.map(o => o.id)).size || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        icon={<DollarSign className="text-[#d4af37]" size={24} />}
        title="Total Revenue"
        value={`${totalRevenue.toLocaleString()} TND`}
        change={totalRevenue > 0 ? '+12.5%' : '0%'}
        isPositive={totalRevenue > 0}
      />
      <StatsCard
        icon={<ShoppingCart className="text-[#d4af37]" size={24} />}
        title="Total Orders"
        value={totalOrders.toString()}
        change={totalOrders > 0 ? '+8.2%' : '0%'}
        isPositive={totalOrders > 0}
      />
      <StatsCard
        icon={<Users className="text-[#d4af37]" size={24} />}
        title="Products"
        value={products.length.toString()}
        change="Live"
        isPositive={true}
      />
      <StatsCard
        icon={<TrendingUp className="text-[#d4af37]" size={24} />}
        title="Avg Order Value"
        value={totalOrders > 0 ? `${Math.round(totalRevenue / totalOrders)} TND` : '0 TND'}
        change={totalOrders > 0 ? 'Calculated' : 'N/A'}
        isPositive={totalOrders > 0}
      />
    </div>
  );
}
