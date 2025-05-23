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
  unitName: string;
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

export interface NFTMetadata {
  name: string;
  unitName: string;
  description: string;
  image: string;
  properties: {
    type: string;
    createdAt: string;
    owner: string;
  };
}