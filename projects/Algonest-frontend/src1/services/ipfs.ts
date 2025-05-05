import axios from 'axios';

// We'll use Web3.Storage for IPFS storage - more reliable than Pinata
const WEB3_STORAGE_TOKEN = import.meta.env.VITE_WEB3_STORAGE_TOKEN;
const WEB3_STORAGE_API = 'https://api.web3.storage';

interface IPFSMetadata {
  name: string;
  description?: string;
  image?: string;
  properties: {
    type: string;
    size: number;
    lastModified: number;
    contentType: string;
  };
}

export const uploadToIPFS = async (file: File, metadata: any): Promise<string> => {
  try {
    // Create metadata following NFT.Storage best practices
    const nftMetadata: IPFSMetadata = {
      name: metadata.name,
      description: metadata.description || `Medical record: ${metadata.name}`,
      properties: {
        type: 'medical_record',
        size: file.size,
        lastModified: file.lastModified,
        contentType: file.type
      }
    };

    // Create a new FormData instance
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(nftMetadata));

    // Upload to Web3.Storage
    const response = await axios.post(`${WEB3_STORAGE_API}/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${WEB3_STORAGE_TOKEN}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the IPFS CID (Content Identifier)
    return response.data.cid;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
};

export const getIPFSUrl = (cid: string): string => {
  // Use IPFS gateway for better reliability
  return `https://w3s.link/ipfs/${cid}`;
};

export const validateIPFSUrl = (url: string): boolean => {
  // Validate IPFS URL format
  const ipfsUrlPattern = /^https:\/\/[^/]+\/ipfs\/[a-zA-Z0-9]+$/;
  return ipfsUrlPattern.test(url);
};