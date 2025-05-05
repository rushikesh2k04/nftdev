import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, Search, Clock, Hash, User, Share2, X } from 'lucide-react';
import { MedicalNFT } from '../types/wallet';
import { useWallet } from '../context/WalletContext';
import { getNFTInfo } from '../services/algorand';

const fetchNFTs = async (): Promise<MedicalNFT[]> => {
  try {
    const nfts = [];
    for (let i = 1; i <= 1000000; i++) {
      const nft = await getNFTInfo(i);
      if (nft) {
        nfts.push(nft);
      }
    }
    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
};

const Marketplace: React.FC = () => {
  const { state: { isConnected } } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'record' | 'image' | 'report'>('all');
  const [selectedNft, setSelectedNft] = useState<MedicalNFT | null>(null);

  const { data: nfts, isLoading } = useQuery({
    queryKey: ['nfts'],
    queryFn: fetchNFTs,
    refetchInterval: 5000
  });

  const handleShare = (platform: string) => {
    if (!selectedNft) return;
    
    const nftUrl = `${window.location.origin}/nft/${selectedNft.assetId}`;
    const text = `Check out this medical NFT: ${selectedNft.name}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${nftUrl}`)}`;
        break;
      case 'gmail':
        shareUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\n${nftUrl}`)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(nftUrl)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(nftUrl)}&text=${encodeURIComponent(text)}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
    setSelectedNft(null);
  };

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

      {filteredNFTs?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No NFTs have been minted yet. Create your first medical NFT from the Medical Services page.</p>
        </div>
      ) : (
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
                    <span>Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-blue-600">{nft.price} ALGO</span>
                  <button
                    onClick={() => setSelectedNft(nft)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {selectedNft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Share NFT</h3>
              <button
                onClick={() => setSelectedNft(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Share URL:</p>
              <div className="bg-gray-50 p-2 rounded-md text-sm break-all">
                {`${window.location.origin}/nft/${selectedNft.assetId}`}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center justify-center space-x-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => handleShare('gmail')}
                className="flex items-center justify-center space-x-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <span>Gmail</span>
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center space-x-2 p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
              >
                <span>Twitter</span>
              </button>
              <button
                onClick={() => handleShare('telegram')}
                className="flex items-center justify-center space-x-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <span>Telegram</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;