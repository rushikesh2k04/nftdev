// Generate random URLs instead of actual IPFS uploads
const generateRandomString = (length: number) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const uploadToIPFS = async (file: File): Promise<string> => {
  // Generate a random URL instead of actual IPFS upload
  const randomId = generateRandomString(16);
  const fileName = file.name.replace(/[^a-zA-Z0-9]/g, '-');
  const url = `ipfs://${randomId}/${fileName}`;
  return url;
};