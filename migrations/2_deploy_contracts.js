var DappToken = artifacts.require("./DappToken.sol");
var DappTokenSale = artifacts.require('./DappTokenSale.sol')
module.exports = function(deployer) {
  deployer.deploy(DappToken, 1000000).then(function(instance){
  	var tokenPrice = 1000000000000000;
  	return deployer.deploy(DappTokenSale, instance.address, tokenPrice);
  });
};
