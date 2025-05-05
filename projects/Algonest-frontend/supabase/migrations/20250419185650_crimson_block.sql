/*
  # Medical NFTs Schema

  1. New Tables
    - `medical_nfts`
      - `id` (uuid, primary key)
      - `asset_id` (bigint, unique) - Algorand asset ID
      - `name` (text) - NFT name
      - `description` (text) - NFT description
      - `image_url` (text) - Preview image URL
      - `ipfs_hash` (text) - IPFS hash of the medical record
      - `price` (numeric) - Price in ALGO
      - `owner_address` (text) - Algorand wallet address of the owner
      - `type` (text) - Type of medical record (record, image, report)
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on medical_nfts table
    - Add policies for:
      - Anyone can read NFTs
      - Only authenticated users can create NFTs
      - Only owners can update their NFTs
*/

CREATE TABLE medical_nfts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id bigint UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  image_url text,
  ipfs_hash text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  owner_address text NOT NULL,
  type text NOT NULL CHECK (type IN ('record', 'image', 'report')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE medical_nfts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read NFTs
CREATE POLICY "Anyone can read medical NFTs"
  ON medical_nfts
  FOR SELECT
  USING (true);

-- Only authenticated users can create NFTs
CREATE POLICY "Authenticated users can create medical NFTs"
  ON medical_nfts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only owners can update their NFTs
CREATE POLICY "Users can update own medical NFTs"
  ON medical_nfts
  FOR UPDATE
  TO authenticated
  USING (owner_address = auth.jwt() ->> 'sub')
  WITH CHECK (owner_address = auth.jwt() ->> 'sub');