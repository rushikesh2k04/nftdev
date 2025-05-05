// Simplified version without actual blockchain interaction
const generateRandomAssetId = () => {
  return Math.floor(Math.random() * 1000000) + 1;
};

const ALGO_GAS_FEE = 0.001; // Simulated gas fee

// In-memory store for minted NFTs
const mintedNFTs = new Map();

export const getNFTInfo = async (assetId: number) => {
  return mintedNFTs.get(assetId) || null;
};

export const createNFT = async (
  creatorAddress: string,
  assetName: string,
  ipfsUrl: string
): Promise<{ assetId: number; gasFee: number }> => {
  // Simulate NFT creation with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const assetId = generateRandomAssetId();
  const nftInfo = {
    id: `nft-${assetId}`,
    assetId,
    name: assetName,
    description: `Medical NFT created by ${creatorAddress}`,
    imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg',
    price: 1.5,
    owner: creatorAddress,
    createdAt: new Date().toISOString(),
    type: 'record'
  };
  
  mintedNFTs.set(assetId, nftInfo);
  
  return {
    assetId,
    gasFee: ALGO_GAS_FEE
  };
};