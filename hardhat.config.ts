import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";

require("solidity-coverage");
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.16",
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.GOERLI_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;

/*
  GOERLI_URL=https://eth-goerli.g.alchemy.com/v2/RFbtW229PpMntp27ZSGUcXWGed4uuk0i
  GOERLI_PRIVATE_KEY=beadc229bdb900700471a477f2df5acb4296acd3c6d2bc1bb7fe015a84370bf6
ETHERSCAN_API_KEY=73VCJEFIMCCXVTNFK5PGJXIP8NMYWG591P

*/