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
      <div className="bg-gray-900 rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-yellow-600">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-yellow-400">Track Your Order</h2>
            <button
              onClick={onClose}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
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
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 pr-12 focus:border-yellow-400 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300"
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
              className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-300 transition-colors font-semibold"
            >
              Track Order
            </button>
          </div>

          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>You can find your Order ID in the confirmation message after placing an order.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;