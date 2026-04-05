import { Hono } from 'hono'
import { prisma } from '../db/prisma'

const analytics = new Hono()

// GET /analytics/gross
// Accepts ?range=(month|six_months|all)
analytics.get('/gross', async (c) => {
  try {
    const range = c.req.query('range') || 'month';
    const now = new Date();
    let startDate = new Date(0); // For 'all'
    
    // Determine the start date based on the requested range
    if (range === 'month') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
    } else if (range === 'six_months') {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 6);
    }

    // Fetch relevant orders from the database
    const orders = await prisma.order.findMany({
      where: {
        status: { 
          in: ['paid', 'completed', 'Delivered', 'Shipped', 'Confirmed'] 
        },
        createdAt: { 
          gte: startDate 
        }
      },
      select: {
        totalAmount: true,
        createdAt: true
      },
      orderBy: { 
        createdAt: 'asc' 
      }
    });

    const dataMap = new Map<string, number>();

    // Process and group the orders based on the range formatting
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      let key = '';

      if (range === 'month') {
        // Group by day (e.g., 'Mar 28')
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (range === 'six_months') {
        // Group by week range (e.g., 'Mar 22 - Mar 28')
        const startOfWeek = new Date(date);
        const day = date.getDay(); // 0 is Sunday
        const diff = date.getDate() - day; // Move to Sunday
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0,0,0,0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23,59,59,999);
        
        const fmt = { month: 'short', day: 'numeric' } as const;
        key = `${startOfWeek.toLocaleDateString('en-US', fmt)} - ${endOfWeek.toLocaleDateString('en-US', fmt)}`;
      } else {
        // Group by year (e.g., '2026')
        key = date.getFullYear().toString();
      }

      const amount = Number(order.totalAmount) || 0;
      dataMap.set(key, (dataMap.get(key) || 0) + amount);
    });

    // Convert map to chronological array
    const result = Array.from(dataMap.entries()).map(([date, revenue]) => ({
      date,
      revenue
    }));

    return c.json({ success: true, data: result });
  } catch (error) {
    console.error('Gross revenue analytics error:', error);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
});

export default analytics;
