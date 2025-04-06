import { defineNuxtPlugin } from '#app'
import { initApiClient } from 'pinia-api-client';

export default defineNuxtPlugin(() => {
  // You might want to use runtime config for the base URL
  // const config = useRuntimeConfig()

  initApiClient({
    baseURL: 'http://localhost:3000/api', // Replace with your actual API base URL
    // headers: { 'X-Custom-Header': 'value' } // Optional: Custom headers
  });
});
