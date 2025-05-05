import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, Menu, Activity } from 'lucide-react';

const Header: React.FC = () => {
  const { state, connect, disconnect } = useWallet();
  const { address, isConnected, isConnecting } = state;

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MedNFT</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/marketplace" className="text-gray-700 hover:text-blue-600">
              Marketplace
            </Link>
            <Link to="/medical-services" className="text-gray-700 hover:text-blue-600 flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              Medical Services
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">
              My Profile
            </Link>
            {isConnected ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {shortenAddress(address!)}
                </span>
                <button
                  onClick={disconnect}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                         disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </nav>

          <div className="md:hidden">
            <button className="p-2">
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;