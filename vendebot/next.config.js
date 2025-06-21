module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Replace with your allowed image domains
  },
  env: {
    AZURE_OPENAI_KEY: process.env.AZURE_OPENAI_KEY,
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
  },
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ];
  },
};