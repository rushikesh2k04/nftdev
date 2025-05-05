import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';
import CryptoJS from 'crypto-js';
import { WalletState } from '../types/wallet';

const peraWallet = new PeraWalletConnect();

interface WalletContextType {
  state: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
  peraWallet: PeraWalletConnect;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  isConnecting: false,
  error: null,
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

type Action =
  | { type: 'SET_CONNECTING' }
  | { type: 'SET_CONNECTED'; address: string }
  | { type: 'SET_DISCONNECTED' }
  | { type: 'SET_ERROR'; error: string };

const walletReducer = (state: WalletState, action: Action): WalletState => {
  switch (action.type) {
    case 'SET_CONNECTING':
      return { ...state, isConnecting: true, error: null };
    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        address: action.address,
        error: null,
      };
    case 'SET_DISCONNECTED':
      return { ...initialState };
    case 'SET_ERROR':
      return {
        ...state,
        isConnecting: false,
        error: action.error,
      };
    default:
      return state;
  }
};

const STORAGE_KEY = 'medical_nft_wallet';
const ENCRYPTION_KEY = 'your-secure-key'; // In production, use environment variable

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  const encryptData = (data: string) => {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  };

  const decryptData = (encryptedData: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    const reconnectWallet = async () => {
      const encryptedAddress = localStorage.getItem(STORAGE_KEY);
      if (encryptedAddress) {
        try {
          const address = decryptData(encryptedAddress);
          const accounts = await peraWallet.reconnectSession();
          if (accounts.includes(address)) {
            dispatch({ type: 'SET_CONNECTED', address });
          }
        } catch (error) {
          console.error('Reconnection failed:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    };

    reconnectWallet();

    return () => {
      peraWallet.disconnect();
    };
  }, []);

  const connect = async () => {
    try {
      dispatch({ type: 'SET_CONNECTING' });
      const accounts = await peraWallet.connect();
      const address = accounts[0];
      const encryptedAddress = encryptData(address);
      localStorage.setItem(STORAGE_KEY, encryptedAddress);
      dispatch({ type: 'SET_CONNECTED', address });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to connect wallet' });
    }
  };

  const disconnect = () => {
    peraWallet.disconnect();
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'SET_DISCONNECTED' });
  };

  return (
    <WalletContext.Provider value={{ state, connect, disconnect, peraWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};