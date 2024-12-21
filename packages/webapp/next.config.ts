import { config } from 'dotenv';
import path from 'path';
import type { NextConfig } from "next";

// Load environment variables from the root directory's .env.local
config({ path: path.resolve(__dirname, '../../.env.local') });

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
