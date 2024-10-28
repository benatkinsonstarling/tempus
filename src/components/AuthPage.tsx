import React, { useState } from 'react';

interface AuthPageProps {
  onClose: () => void;
  isLight: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ onClose, isLight }) => {
  const [isLogin, setIsLogin] = useState(true);
  const textColor = isLight ? 'text-gray-800' : 'text-white';
  const bgColor = isLight ? 'bg-white bg-opacity-20' : 'bg-black bg-opacity-20';

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${textColor}`}>
      <div className={`${bgColor} p-8 rounded-lg shadow-lg w-96 backdrop-blur-md`}>
        <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input type="email" id="email" className="w-full px-3 py-2 border rounded text-gray-800" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Password</label>
            <input type="password" id="password" className="w-full px-3 py-2 border rounded text-gray-800" />
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
              <input type="password" id="confirmPassword" className="w-full px-3 py-2 border rounded text-gray-800" />
            </div>
          )}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
        <button onClick={onClose} className="mt-4 w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400">
          Close
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
