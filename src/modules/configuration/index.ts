export default () => ({
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  port: process.env.APP_PORT,
  app_env: process.env.APP_ENV,
  ethereum_network: process.env.ETHEREUM_NETWORK,
  session_secret: process.env.SESSION_SECRET,
  infura: {
    project_id: process.env.INFURA_PROJECT_ID,
  },
  etherscan_api_key: process.env.ETHERSCAN_API_KEY,
  recent_block_gap: process.env.RECENT_BLOCK_GAP,
});
