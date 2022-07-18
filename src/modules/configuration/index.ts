export default () => ({
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  port: process.env.APP_PORT,
  alchemy_token: process.env.ALCHEMY_TOKEN,
  chainstack_url: process.env.CHAINSTACK_URL,
  quicknode_url: process.env.QUICKNODE_URL,
  app_env: process.env.APP_ENV,
  ethereum_network: process.env.ETHEREUM_NETWORK,
  ethereum_quorum: process.env.ETHEREUM_QUORUM,
  infura: {
    project_id: process.env.INFURA_PROJECT_ID,
    project_secret: process.env.INFURA_PROJECT_SECRET,
  },
  session_secret: process.env.SESSION_SECRET,
  etherscan_api_key: process.env.ETHERSCAN_API_KEY,
  recent_block_gap: process.env.RECENT_BLOCK_GAP,
  query_limit: process.env.QUERY_LIMIT,
  skippingCounterLimit: process.env.SKIPPING_COUNTER_LIMIT,
});
