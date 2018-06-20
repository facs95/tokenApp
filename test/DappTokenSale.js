var DappTokenSale = artifacts.require('./DappTokenSale.sol');
var DappToken = artifacts.require("./DappToken.sol");

contract('DappTokenSale', function(accounts){
	var admin = accounts[0];
	var tokenInstance;
	var tokenSaleInstance;
	var tokenPrice = 1000000000000000; //in wei
	var buyer = accounts[1];
	var numberOfTokens;
	var tokensAvailable = 750000;
	it('initializes the contract with the correct values', function(){
		return DappTokenSale.deployed().then(function(instance){
			tokenSaleInstance = instance;
			return tokenSaleInstance.address;
		}).then(function(address){
			assert.notEqual(address,0x0,'address exist');
			return tokenSaleInstance.tokenContract();
		}).then(function(address){
			assert.notEqual(address, 0x0, 'has token contract address');
			return tokenSaleInstance.tokenPrice();
		}).then(function(price){
			assert.equal(price, tokenPrice, 'token price is correct');
		});
	});

	it('facelitates token buying', function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return DappTokenSale.deployed();
		}).then(function(instance){
			tokenSaleInstance = instance;
			//admin 
			//provision 75% of all tokens to the token sale
			return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin})
		}).then(function(receipt){
			numberOfTokens = 10;
			return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: numberOfTokens * tokenPrice});
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'trigger one event');
			assert.equal(receipt.logs[0].event, 'Sell', 'Should be the "Sell" event');
			assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that has purchased the tokens');
			assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
			return tokenSaleInstance.tokensSold();
		}).then(function(amount){
			assert.equal(amount.toNumber(), numberOfTokens, 'Increments the number of tokens sold');
			return tokenInstance.balanceOf(buyer);
		}).then(function(balance){
			assert.equal(balance.toNumber(), numberOfTokens);
			return tokenInstance.balanceOf(tokenSaleInstance.address);
		}).then(function(balance){
			assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
			//try to buy tokens different from the ether value
			return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 1});
		}).then(assert.fail).catch(function(error){
			//try to buy more tokens than available
			assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
			return tokenSaleInstance.buyTokens(800000, {from: buyer, value: numberOfTokens * tokenPrice});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'token contract should have enough balance');
		});
	});

	it('ends token sale function', function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return DappTokenSale.deployed();
		}).then(function(instance){
			tokenSaleInstance = instance;
			return tokenSaleInstance.endSale({from: buyer})
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'Function has to be called by admin');
			return tokenSaleInstance.endSale({from: admin});
		}).then(function(receipt){
			return tokenInstance.balanceOf(admin);
		}).then(function(balance){
			assert(balance.toNumber(), 999990, 'contract returns all the unsused tokens');
		//	return tokenSaleInstance.tokenPrice();
		//}).then(function(price){
			//assert.equal(price.toNumber(), 0, 'returns value to default, kills contract');
		});
	});
});