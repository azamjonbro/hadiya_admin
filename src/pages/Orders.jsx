import { useAppStore } from '../store/useStore';
import CustomSelect from '../components/CustomSelect';

export default function Orders() {
  const { orders, updateOrderStatus } = useAppStore();

  const handleStatusChange = (id, newStatus) => {
    updateOrderStatus(id, newStatus);
  };

  const statusOptions = [
    { value: 'Kutilmoqda', label: 'Kutilmoqda' },
    { value: 'Yetkazilmoqda', label: 'Yetkazilmoqda' },
    { value: 'Yetkazib berildi', label: 'Yetkazib berildi' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-dark-text">Buyurtmalar</h1>
        <p className="text-dark-textMuted mt-1">Mijozlar buyurtmalari ro'yxati</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {orders.map(order => (
          <div key={order.id} className="card">
            <div className="flex justify-between items-start mb-4 border-b border-dark-border pb-4">
              <div>
                <h3 className="font-bold text-lg">{order.customerName}</h3>
                <p className="text-dark-textMuted text-sm mt-1">{order.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.status === 'Kutilmoqda' 
                  ? 'bg-orange-500/10 text-orange-500' 
                  : 'bg-green-500/10 text-green-500'
              }`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-dark-textMuted mb-6">
              <p><strong className="text-dark-text">Manzil:</strong> {order.address}</p>
              <p><strong className="text-dark-text">Telefon:</strong> {order.phone}</p>
              <p><strong className="text-dark-text">Umumiy summa:</strong> <span className="text-primary-400 font-bold">${order.total}</span></p>
            </div>

            <div className="flex justify-end pt-2">
              <CustomSelect
                options={statusOptions}
                value={order.status}
                onChange={(newStatus) => handleStatusChange(order.id, newStatus)}
              />
            </div>
          </div>
        ))}
        
        {orders.length === 0 && (
          <div className="col-span-full card text-center py-12 text-dark-textMuted">
            Hozircha buyurtmalar yo'q
          </div>
        )}
      </div>
    </div>
  );
}
