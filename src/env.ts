import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  FS_BASE_URL: z.string().url(),
  FS_API_VERSION: z.string().default('3'),
  FS_API_TOKEN: z.string().min(1),
});

export const env = envSchema.parse(process.env);