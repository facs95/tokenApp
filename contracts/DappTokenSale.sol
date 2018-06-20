pragma solidity ^0.4.19;
import './DappToken.sol';
/**
 * The DappTokenSale contract does this and that...
 */

contract DappTokenSale {
	address admin;
	DappToken public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokensSold;

	event Sell(address  _buyer,
		uint256 _amount);
	


	constructor (DappToken _tokenContract, uint256 _tokenPrice) public {
		//assign an admin
		admin = msg.sender;
		//token contract 
		tokenContract = _tokenContract;
		//token price
		tokenPrice = _tokenPrice;
	}	

	//multiply function
	function multiply (uint256 x, uint256 y) internal pure returns (uint256 z){
		
		require (y == 0 || (z = x * y)/ y == x);
		
	}
	

	function buyTokens (uint256 _numberOfTokens) public payable {
		//require that value is equal to tokens
		require (tokenContract.balanceOf(this) >= _numberOfTokens);
		//requre that the contract has enough tokens
		require (msg.value == multiply(_numberOfTokens, tokenPrice));
		//rquire that a transfer is succesful
		require (tokenContract.transfer(msg.sender, _numberOfTokens));
		//keep track of tokensSold
		tokensSold += _numberOfTokens;
		//trigger Sell event
		emit Sell(msg.sender, _numberOfTokens);
	}

	function endSale () public {
		//requiere that only an admin can do this
		require (msg.sender == admin);
		//transfer the amount of tokens in the contract back to admin
		require (tokenContract.transfer(admin, tokenContract.balanceOf(this)));
		//destroy the contract
		selfdestruct(this);
	}
	
	
}
