import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "hardhat-deploy";
import "hardhat-gas-reporter"
require('@typechain/hardhat')
require('@nomicfoundation/hardhat-ethers')
require('@nomicfoundation/hardhat-chai-matchers')
import "@nomicfoundation/hardhat-ethers";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    localhost: {
      url: "http://localhost:8545",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ],
    },
  },
  mocha: {
    timeout: 500000,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
   gasReporter: {
    enabled: false,
  }
};

export default config;
