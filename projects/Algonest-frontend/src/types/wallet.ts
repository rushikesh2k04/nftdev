export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export interface MedicalNFT {
  id: string;
  assetId: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  owner: string;
  ipfsHash: string;
  createdAt: string;
  type: 'record' | 'image' | 'report';
  permissions: string[];
  assetInfo?: any;
}