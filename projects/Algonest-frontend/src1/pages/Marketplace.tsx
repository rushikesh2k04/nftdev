import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, Search, Clock, Hash, User, Link as LinkIcon } from 'lucide-react';
import { MedicalNFT } from '../types/wallet';
import { useWallet } from '../context/WalletContext';
import { getNFTInfo } from '../services/algorand';

const fetchNFTs = async (): Promise<MedicalNFT[]> => {
  try {
    const mockNFTs = [];
    const nftsWithDetails = await Promise.all(
      mockNFTs.map(async (nft) => {
        try {
          const assetInfo = await getNFTInfo(nft.assetId);
          return {
            ...nft,
            assetInfo
          };
        } catch (error) {
          console.error(`Error fetching NFT info for asset ${nft.assetId}:`, error);
          return nft;
        }
      })
    );

    return nftsWithDetails;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
};

const Marketplace: React.FC = () => {
  const { state: { isConnected } } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'record' | 'image' | 'report'>('all');

  const { data: nfts, isLoading } = useQuery({
    queryKey: ['nfts'],
    queryFn: fetchNFTs
  });

  const filteredNFTs = nfts?.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || nft.type === filter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Medical NFT Marketplace</h1>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search medical records..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All Types</option>
              <option value="record">Medical Records</option>
              <option value="image">Medical Images</option>
              <option value="report">Lab Reports</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNFTs?.map((nft) => (
          <div key={nft.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={nft.imageUrl}
              alt={nft.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{nft.name}</h3>
              <p className="text-sm text-gray-600">{nft.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Hash className="h-4 w-4 mr-2" />
                  <span>Token ID: {nft.assetId}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Created: {new Date(nft.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-2" />
                  <span>Owner: {nft.owner}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  <a
                    href={`https://ipfs.io/ipfs/${nft.ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View on IPFS
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-blue-600">{nft.price} ALGO</span>
                <button
                  disabled={!isConnected}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                           disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isConnected ? 'Purchase' : 'Connect Wallet'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;