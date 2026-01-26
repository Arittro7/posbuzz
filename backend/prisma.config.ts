import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: 'postgresql://neondb_owner:npg_MvIm4qQ0FZbW@ep-royal-dew-ah7v7ago-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  },
});
