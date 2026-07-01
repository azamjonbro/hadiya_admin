import { useAppStore } from '../store/useStore';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Yan', daromad: 4000, buyurtma: 24 },
  { name: 'Fev', daromad: 3000, buyurtma: 13 },
  { name: 'Mar', daromad: 5000, buyurtma: 98 },
  { name: 'Apr', daromad: 4780, buyurtma: 39 },
  { name: 'May', daromad: 5890, buyurtma: 48 },
  { name: 'Iyun', daromad: 4390, buyurtma: 38 },
  { name: 'Iyul', daromad: 6490, buyurtma: 43 },
];

export default function Dashboard() {
  const { products, orders, managers } = useAppStore();

  const stats = [
    { name: 'Umumiy Tushum', value: `$${orders.reduce((acc, order) => acc + order.total, 0)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Buyurtmalar', value: orders.length, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Mahsulotlar', value: products.length, icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Menajerlar', value: managers.length, icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-dark-text">Dashboard</h1>
        <p className="text-dark-textMuted mt-1">Tizimning umumiy statistikasi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="card flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-dark-textMuted">{stat.name}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card mt-6">
        <h2 className="text-lg font-semibold mb-4 text-dark-text">Sotuvlar Statistikasi</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDaromad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e3342" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e2330', borderColor: '#2e3342', borderRadius: '8px', color: '#f1f5f9' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="daromad" name="Daromad" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDaromad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Oxirgi buyurtmalar qismi */}
      <div className="card mt-8">
        <h2 className="text-lg font-semibold mb-4">Oxirgi Buyurtmalar</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-dark-textMuted border-b border-dark-border">
                <th className="pb-3 font-medium">Mijoz</th>
                <th className="pb-3 font-medium">Sana</th>
                <th className="pb-3 font-medium">Summa</th>
                <th className="pb-3 font-medium">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id}>
                  <td className="py-4">{order.customerName}</td>
                  <td className="py-4 text-dark-textMuted">{order.date}</td>
                  <td className="py-4 font-medium">${order.total}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-500">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
