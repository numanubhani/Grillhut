import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { getOrders } from '../utils/storage';
import OrderTracking from './OrderTracking';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const [orderId, setOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    const orders = getOrders();
    const order = orders.find(o => o.id === orderId.trim());
    
    if (order) {
      setSelectedOrder(order);
      setError('');
    } else {
      setError('Order not found');
      setSelectedOrder(null);
    }
  };

  if (!isOpen) return null;

  if (selectedOrder) {
    return (
      <OrderTracking
        isOpen={true}
        onClose={() => {
          setSelectedOrder(null);
          setOrderId('');
          onClose();
        }}
        order={selectedOrder}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-md border border-blue-500/30 shadow-2xl">
        <div className="p-6 border-b border-blue-500/30">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Track Your Order</h2>
            <button
              onClick={onClose}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2">Enter Order ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID"
                  className="w-full bg-slate-700 text-white border border-blue-500/30 rounded px-4 py-2 pr-12 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-600 text-white p-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg"
            >
              Track Order
            </button>
          </div>

          <div className="mt-6 text-center text-slate-400 text-sm">
            <p>You can find your Order ID in the confirmation message after placing an order.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;