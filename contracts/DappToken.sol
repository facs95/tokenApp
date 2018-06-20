pragma solidity ^0.4.19;

/**
 * The DappToken contract does this and that...
 */
 //msg--> globarl variable with values 
contract DappToken {
	//name
	string public name = "Dapp Token";
	string public symbol = "DAPP";
	string public standard = "Dapp token v1.0";
	uint256 public totalSupply;

	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
	);

	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value);

	mapping (address => uint256) public balanceOf;
	mapping (address => mapping (address => uint256)) public allowance;
	

	constructor (uint256 _initialSupply) public {
		balanceOf[msg.sender] = _initialSupply;
		totalSupply = _initialSupply;
		//allocate the _initialSupply
	}

	//transfer
	function transfer (address _to, uint256 _value) public returns (bool success) {
		//exception if account doesnt have enough
		require(balanceOf[msg.sender] >= _value);
		//transfer the balance
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		//transfer event
		emit Transfer(msg.sender, _to,_value);
		//return a boolean of success
		return true;
	}

	//delegated transfer
	//appprove
	function approve (address _spender, uint256 _value) public returns(bool success) {
		//allowance
		allowance[msg.sender][_spender] = _value;
		//approve event
		emit Approval(msg.sender, _spender, _value);
		return true;
	}

	function transferFrom (address _from, address _to, uint256 _value) public returns(bool success) {
		//require _from has enough tokens
		require (balanceOf[_from] >= _value);
		//require allowance is big enough
		require (allowance[_from][msg.sender] >= _value);
		//change the balance
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		//update de allowance
		allowance[_from][msg.sender] -= _value;
		//Transfer event
		emit Transfer(_from, _to, _value);
		return true;
	}
	
	
	
}
