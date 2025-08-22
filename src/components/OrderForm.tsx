import React, { useState } from 'react';
import { X, Upload, Truck } from 'lucide-react';
import { CartItem, Order } from '../types';
import { saveOrder, clearCart } from '../utils/storage';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderPlaced: (orderId: string) => void;
  singleItem?: any;
}

const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose, items, onOrderPlaced, singleItem }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [screenshot, setScreenshot] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const orderItems = singleItem ? [{ ...singleItem, quantity: 1 }] : items;
  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order: Order = {
      id: Date.now().toString(),
      items: orderItems,
      total,
      status: 'received',
      paymentMethod,
      paymentScreenshot: paymentMethod === 'online' ? screenshot : undefined,
      customerInfo,
      timestamp: Date.now()
    };

    saveOrder(order);
    if (!singleItem) {
      clearCart();
    }
    
    setOrderId(order.id);
    setShowConfirmation(true);
    onOrderPlaced(order.id);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshot(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTrackOrder = () => {
    setShowConfirmation(false);
    onClose();
    // This will trigger the order tracking modal
    setTimeout(() => {
      const trackButton = document.querySelector('[data-track-order]') as HTMLButtonElement;
      if (trackButton) trackButton.click();
    }, 100);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    onClose();
    // Reset form
    setCustomerInfo({ name: '', phone: '', address: '' });
    setPaymentMethod('cash');
    setScreenshot('');
  };
  if (!isOpen) return null;

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-black rounded-xl w-full max-w-md border border-yellow-500/30 shadow-2xl my-8">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
            <p className="text-gray-300 mb-4">Your Order ID is:</p>
            <div className="bg-gray-800 rounded-lg p-3 mb-4">
              <p className="text-2xl font-bold text-yellow-400">#{orderId}</p>
            </div>
            <p className="text-yellow-400 font-semibold mb-6">🍳 Your order is now cooking!</p>
            
            <button
              onClick={handleCloseConfirmation}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 font-semibold shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-black rounded-xl w-full max-w-2xl max-h-screen overflow-y-auto border border-yellow-500/30 shadow-2xl my-8">
        <div className="p-4 sm:p-6 border-b border-yellow-500/30">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Place Your Order</h2>
            <button
              onClick={onClose}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Order Summary</h3>
            <div className="space-y-2">
              {orderItems.map(item => (
                <div key={item.id} className="flex justify-between text-gray-300 text-sm sm:text-base">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-gray-700 pt-2 flex justify-between text-yellow-400 font-bold text-sm sm:text-base">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Customer Information</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="w-full bg-gray-800 text-white border border-yellow-500/30 rounded px-4 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                className="w-full bg-gray-800 text-white border border-yellow-500/30 rounded px-4 py-2 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                required
              />
              <textarea
                placeholder="Delivery Address"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                className="w-full bg-gray-800 text-white border border-yellow-500/30 rounded px-4 py-3 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Payment Method</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 text-white">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                  className="text-yellow-400"
                />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center space-x-3 text-white">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'online')}
                  className="text-yellow-400"
                />
                <span>Online Payment (Bank Transfer)</span>
              </label>
            </div>

            {paymentMethod === 'online' && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-yellow-500/20">
                <h4 className="text-white font-semibold mb-2">Bank Transfer Details</h4>
                <div className="text-gray-300 space-y-1 text-sm">
                  <p>Account Name: Grill Hut Restaurant</p>
                  <p>Account Number: 1234567890</p>
                  <p>Bank: State Bank of India</p>
                  <p>IFSC Code: SBIN0001234</p>
                </div>
                <div className="mt-4">
                  <label className="block text-white mb-2">Upload Payment Screenshot</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="w-full bg-gray-700 text-white border border-yellow-500/30 rounded px-4 py-2 focus:border-yellow-400 focus:outline-none"
                    required
                  />
                  {screenshot && (
                    <div className="mt-2 flex justify-center">
                      <img src={screenshot} alt="Payment screenshot" className="max-w-full max-h-32 object-contain rounded" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 font-semibold shadow-lg"
          >
            Confirm Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;