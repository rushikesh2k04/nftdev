import algosdk from 'algosdk';

// Connect to TestNet
const algodClient = new algosdk.Algodv2(
  '',
  'https://testnet-api.algonode.cloud',
  ''
);

export const createNFT = async (
  creatorAddress: string,
  assetName: string,
  fileName: string,
  ipfsHash: string
): Promise<number> => {
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();

    // Create NFT with proper metadata following ASA best practices
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: creatorAddress,
      total: 1, // NFTs should have total supply of 1
      decimals: 0, // NFTs should have 0 decimals
      assetName: assetName,
      unitName: 'MEDNFT',
      assetURL: `ipfs://${ipfsHash}`, // Use IPFS protocol
      defaultFrozen: false,
      suggestedParams: suggestedParams,
      // Add metadata hash if available
      assetMetadataHash: ipfsHash ? Buffer.from(ipfsHash).slice(0, 32) : undefined,
    });

    // Sign and submit transaction
    const signedTxn = await window.algorand.signTransaction(txn.toByte());
    const response = await algodClient.sendRawTransaction(signedTxn).do();

    // Wait for confirmation
    await algosdk.waitForConfirmation(algodClient, response.txId, 4);

    // Get the asset ID
    const ptx = await algodClient.pendingTransactionInformation(response.txId).do();
    return ptx['asset-index'];
  } catch (error) {
    console.error('Error creating NFT:', error);
    throw new Error('Failed to create NFT on Algorand');
  }
};

export const getNFTInfo = async (assetId: number) => {
  try {
    const asset = await algodClient.getAssetByID(assetId).do();
    return {
      ...asset,
      ipfsUrl: asset.params.url ? asset.params.url.replace('ipfs://', 'https://w3s.link/ipfs/') : null,
    };
  } catch (error) {
    console.error('Error fetching NFT info:', error);
    throw error;
  }
};