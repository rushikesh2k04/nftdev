import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const createMedicalNFT = async ({
  assetId,
  name,
  description,
  imageUrl,
  ipfsHash,
  price,
  ownerAddress,
  type
}: {
  assetId: number;
  name: string;
  description?: string;
  imageUrl?: string;
  ipfsHash: string;
  price: number;
  ownerAddress: string;
  type: 'record' | 'image' | 'report';
}) => {
  const { data, error } = await supabase
    .from('medical_nfts')
    .insert({
      asset_id: assetId,
      name,
      description,
      image_url: imageUrl,
      ipfs_hash: ipfsHash,
      price,
      owner_address: ownerAddress,
      type
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const fetchMedicalNFTs = async () => {
  const { data, error } = await supabase
    .from('medical_nfts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateMedicalNFT = async (id: string, updates: Partial<{
  name: string;
  description: string;
  price: number;
  type: 'record' | 'image' | 'report';
}>) => {
  const { data, error } = await supabase
    .from('medical_nfts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};