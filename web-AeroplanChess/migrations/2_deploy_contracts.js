const AeroplaneChess = artifacts.require("AeroplaneChess");

module.exports = function(deployer) {
  deployer.deploy(AeroplaneChess);
};
