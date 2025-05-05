import axios from 'axios';
import FormData from 'form-data';

const PINATA_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyM2JlZDY5OC1kNTM3LTRlOTItYWZmZC0yOTZhNWMyZDJjNTYiLCJlbWFpbCI6InNyaWthcm5pdmFzLjI0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIwM2VhNzMwNmE2M2Y2NWUwZTBmMiIsInNjb3BlZEtleVNlY3JldCI6ImJiZWY3YmQ0MWI4ZWNmMTI5NDA0Yjk1ZmFkY2U4YjIzNGU5OTNhYTEzNjVmNmY4NmE5OTVmZmU3NTk3MTU3NDQiLCJleHAiOjE3NzYzNTk3NDl9.Urf_EZo2saEpSvDB06WBhgP5nBYoLM-HAgFhW19JwvY';

export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    // Step 1: Upload File to IPFS
    const fileData = new FormData();
    fileData.append('file', file);

    const fileRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', fileData, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });

    const fileHash = fileRes.data.IpfsHash;
    const fileUrl = `ipfs://${fileHash}`;

    // Step 2: Create metadata JSON
    const metadata = {
      name: file.name,
      description: `Medical record: ${file.name}`,
      file: fileUrl,
    };

    // Step 3: Upload metadata to IPFS
    const jsonBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const metadataFormData = new FormData();
    metadataFormData.append('file', jsonBlob, 'metadata.json');

    const metadataRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', metadataFormData, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });

    return `ipfs://${metadataRes.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
};