import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { Upload, AlertCircle } from 'lucide-react';
import { uploadToIPFS } from '../services/ipfs';
import { createNFT } from '../services/algorand';

const MedicalServices: React.FC = () => {
  const { state: { address, isConnected } } = useWallet();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleIpfsUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setIsLoading(true);
      setUploadError(null);
      const url = await uploadToIPFS(selectedFile);
      setIpfsUrl(url);
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      setUploadError('Failed to upload to IPFS. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMintNFT = async () => {
    if (!ipfsUrl || !address) return;
    
    try {
      setIsLoading(true);
      const { assetId, gasFee } = await createNFT(
        address,
        selectedFile?.name || 'Medical Record',
        ipfsUrl
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
          <h2 className="text-xl font-semibold text-gray-900">Generate IPFS URL</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">Upload your medical record to generate an IPFS URL.</p>
        <div className="space-y-4">
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
          {uploadError && (
            <div className="text-red-600 text-sm">{uploadError}</div>
          )}
          <button
            onClick={handleIpfsUpload}
            disabled={!selectedFile || isLoading}
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
              <a
                href={`https://gateway.pinata.cloud/ipfs/${ipfsUrl.replace('ipfs://', '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
              >
                View on IPFS Gateway
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Upload className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Mint NFT</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">Create an NFT from your IPFS URL.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">IPFS URL</label>
            <input
              type="text"
              value={ipfsUrl}
              onChange={(e) => setIpfsUrl(e.target.value)}
              placeholder="Enter IPFS URL"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-600">
            <p>Estimated Gas Fee: 0.001 ALGO</p>
          </div>
          <button
            onClick={handleMintNFT}
            disabled={!ipfsUrl || isLoading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 
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