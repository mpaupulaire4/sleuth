import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.paupulaire.sleuth',
  appName: 'svelte-sleuth',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
