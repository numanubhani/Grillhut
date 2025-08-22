import React from 'react';
import { X, CheckCircle, Clock, Truck, ChefHat } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const getStatusIcon = (status: string, currentStatus: string) => {
    const isActive = status === currentStatus;
    const isCompleted = ['received', 'cooking', 'preparing', 'delivered'].indexOf(status) <= 
                      ['received', 'cooking', 'preparing', 'delivered'].indexOf(currentStatus);
    
    const iconClass = isCompleted ? 'text-green-400' : 'text-gray-400';
    
    switch (status) {
      case 'received':
        return <CheckCircle className={iconClass} size={24} />;
      case 'cooking':
        return <ChefHat className={iconClass} size={24} />;
      case 'preparing':
        return <Clock className={iconClass} size={24} />;
      case 'delivered':
        return <Truck className={iconClass} size={24} />;
      default:
        return <Clock className={iconClass} size={24} />;
    }
  };

  const statusLabels = {
    received: 'Order Received',
    cooking: 'Cooking',
    preparing: 'Preparing for Delivery',
    delivered: 'Delivered'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl">
        <div className="p-6 border-b border-yellow-600">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-yellow-400">Order Tracking</h2>
            <button
              onClick={onClose}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-300">Order ID: <span className="text-yellow-400">{order.id}</span></p>
            <p className="text-gray-300">Total: <span className="text-yellow-400">₹{order.total}</span></p>
            <p className="text-gray-300">Payment: <span className="text-yellow-400 capitalize">{order.paymentMethod}</span></p>
          </div>

          <div className="space-y-6">
            {Object.entries(statusLabels).map(([status, label]) => (
              <div key={status} className="flex items-center space-x-4">
                {getStatusIcon(status, order.status)}
                <div className="flex-1">
                  <h3 className={`font-semibold ${status === order.status ? 'text-yellow-400' : 
                    ['received', 'cooking', 'preparing', 'delivered'].indexOf(status) <= 
                    ['received', 'cooking', 'preparing', 'delivered'].indexOf(order.status) ? 'text-green-400' : 'text-gray-400'}`}>
                    {label}
                  </h3>
                  {status === order.status && (
                    <p className="text-gray-300 text-sm">Current Status</p>
                  )}
                </div>
                {status === order.status && (
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-800 rounded">
            <h3 className="text-white font-semibold mb-2">Delivery Information</h3>
            <p className="text-gray-300">Name: {order.customerInfo.name}</p>
            <p className="text-gray-300">Phone: {order.customerInfo.phone}</p>
            <p className="text-gray-300">Address: {order.customerInfo.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;