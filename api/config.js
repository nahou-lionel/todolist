// API Configuration
// Set USE_MOCK_API to true to use mock data instead of real API
// This is useful when you don't have access to the university network

export const API_CONFIG = {
  USE_MOCK_API: true, // Change to false when connected to university network
  REAL_API_URL: 'http://graphql.unicaen.fr:4000',
  MOCK_DELAY: 500 // Simulated network delay in milliseconds
}
