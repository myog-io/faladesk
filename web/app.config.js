import 'dotenv/config';
import appJson from './app.json';

export default ({ config }) => ({
  ...appJson,
  expo: {
    ...appJson.expo,
    env: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
});
