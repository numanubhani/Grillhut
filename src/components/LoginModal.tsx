import React, { useState } from 'react';
import { X, User, Lock } from 'lucide-react';
import { login } from '../utils/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = login(email, password);
    if (user) {
      onLogin(user);
      onClose();
      setEmail('');
      setPassword('');
    } else {
      setError('Invalid credentials');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl w-full max-w-md border border-blue-500/30 shadow-2xl">
        <div className="p-6 border-b border-blue-500/30">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              {isSignup ? 'Sign Up' : 'Login'}
            </h2>
            <button
              onClick={onClose}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-600 text-white p-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-white mb-2">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700 text-white border border-blue-500/30 rounded pl-10 pr-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700 text-white border border-blue-500/30 rounded pl-10 pr-4 py-2 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>

          <div className="text-center text-slate-400 text-sm">
            <p>Demo Admin Login:</p>
            <p>Email: admin@admin.com</p>
            <p>Password: admin</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;