const path = require("path");
const HDWalletProvider = require('truffle-hdwallet-provider');

//
const fs = require('fs');
const mnemonic = "lava local flee balance gesture fever average play burden grant quantum peace"; 

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/74e1ce893d0343d38cbec698f4f4ac7f`),
      network_id: 3,       // Ropsten's id
      // gas: 5500000,        // Ropsten has a lower block limit than mainnet
      // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
  }
};
