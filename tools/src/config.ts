const path = require('path');
require("dotenv").config();

const blockchain = {
  id: process.env.CHAIN_ID ? Number.parseInt(process.env.BLOCKCHAIN_ID as string) : 5777,
  airdrop: process.env.CHAIN_AIRDROP || '0x52B7D2DCC80CD2E4000000',
  data_path: path.join(__dirname, '..', '..', 'data')
}

export { blockchain }