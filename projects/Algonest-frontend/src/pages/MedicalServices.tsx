import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Upload, AlertCircle } from 'lucide-react';
import { uploadToIPFS } from '../services/ipfs';
import { createNFT } from '../services/algorand';

const MedicalServices: React.FC = () => {
  const { state: { address, isConnected } } = useWallet();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [unitName, setUnitName] = useState('');
  const [description, setDescription] = useState('');
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleIpfsUpload = async () => {
    if (!selectedFile || !name || !unitName) return;
    
    try {
      setIsLoading(true);
      setUploadError(null);
      const url = await uploadToIPFS(selectedFile, name, unitName, description);
      setIpfsUrl(url);
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      setUploadError('Failed to upload to IPFS. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMintNFT = async () => {
    if (!ipfsUrl || !address || !name || !unitName) return;
    
    try {
      setIsLoading(true);
      const imageUrl = imagePreview || 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg';
      const { assetId, gasFee } = await createNFT(
        address,
        name,
        unitName,
        description,
        ipfsUrl,
        imageUrl
      );
      alert(`NFT created successfully!\nAsset ID: ${assetId}\nGas Fee: ${gasFee} ALGO`);
      navigate('/marketplace');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600">Please connect your wallet to access medical services.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Services</h1>
          <p className="mt-2 text-gray-600">Upload and mint your medical records as NFTs</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Upload className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Create Medical NFT</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter asset name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Unit Name</label>
            <input
              type="text"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              placeholder="Enter unit name (e.g., MEDNFT)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Medical Record</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
            />
          </div>

          {imagePreview && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs rounded-lg shadow-md"
              />
            </div>
          )}

          {uploadError && (
            <div className="text-red-600 text-sm">{uploadError}</div>
          )}

          <button
            onClick={handleIpfsUpload}
            disabled={!selectedFile || !name || !unitName || isLoading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 
                     disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Generating URL...
              </>
            ) : (
              'Generate IPFS URL'
            )}
          </button>

          {ipfsUrl && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">IPFS URL:</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 break-all">{ipfsUrl}</p>
              <button
                onClick={handleMintNFT}
                disabled={isLoading}
                className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 
                         disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Minting NFT...
                  </>
                ) : (
                  'Mint NFT'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-blue-400" />
          <p className="ml-3 text-sm text-blue-700">
            Your medical records will be stored securely on IPFS and minted as unique tokens on the Algorand blockchain.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalServices;